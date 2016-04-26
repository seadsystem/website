"use strict";

var c3 = require('c3');

var HOUR_SECONDS = 60 * 60;
var DAY_SECONDS = HOUR_SECONDS * 24;


function fetch_pie() {
    var end = Math.floor(Date.now() / 1000);
    var start = end - DAY_SECONDS*2;
    var gran = DAY_SECONDS;
    
    fetch_aggregate([create_url(start, end, gran, "Panel1"),
             create_url(start, end, gran, "Panel2"),
             create_url(start, end, gran, "Panel3")],
             pie, true);
}

function pie(responses) {
    var data = [];
    for (var i = 0; i < responses.length; i++) {
        data[i] = ['Panel ' + (i+1), JSON.parse(responses[i]).data[0].energy];
    }
    c3.generate({
        padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        bindto: '#pie',
        data: {
            // iris data from R
            columns: data,
            type: 'pie',
        },
        pie: {
            label: {
                format: function(value, ratio, id) {
                    return Math.round(value * 100) / 100 + " kW";
                }
            }
        }
    });
}

function generate_bar_graph(data) {
    c3.generate({
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 60,
        },
        bindto: '#bar',
        data: {
            x: 'x',
            xFormat: '%Y-%m-%d %H:%M:%S',
            columns: [
                ['x'].concat(data.data.map( function(x) { return x.time; })), 
                ['energy'].concat(data.data.map( function(x) { return Math.round(x.energy * 100) / 100}))
            ],
            type: 'bar',
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    // displays day of week
                    format: '%a'
                }
            },
            y: {
                tick: {
                    format: function (d) { return d + " kWh"; }
                }
            }
        },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        }
    });
}

function post_data_to_server(label) {
    console.log("Sending " + JSON.stringify(label));

    var post = new XMLHttpRequest();

    // device ID is 3rd entry in url seperatered by a '/'
    var pathArray = window.location.pathname.split('/'); 
    var deviceId = pathArray[2];
    var url = "http://db.sead.systems:8080/" + deviceId + "/label";
    var params = JSON.stringify({data: label});
    post.open("POST", url, true);

    post.setRequestHeader("Content-type", "text/plain");
    post.setRequestHeader("Content-length", params.length);
    post.setRequestHeader("Connection", "close");

    post.onreadystatechange = function() {
        if (post.readyState == XMLHttpRequest.DONE) {
            if (post.status == 200) { //200 OK
                console.log("Response:");
                console.log(post.responseText);
            } else {
                console.log("it broke");
            }
        }
    }
    post.send(params);
}


function create_url(start, end, gran, panel) {
    if (gran) {
        var granularity = gran;
    } else {
        var num_nodes = 150;
        var granularity = Math.ceil((end - start) / num_nodes);
    }

    // device ID is 3rd entry in url seperatered by a '/'
    var pathArray = window.location.pathname.split('/'); 
    var deviceId = pathArray[2];
    if (!panel) panel = $('input[type=radio][name=panels]:checked').val();

    return "http://db.sead.systems:8080/" + deviceId + "?start_time=" + start + "&end_time=" 
            + end + "&list_format=energy&type=P&device=" + panel + "&granularity=" + granularity;
}


var repeater = null;
//repeat in ms
function pick(func, repeat) {
    if (repeater) {
        clearInterval(repeater);
        repeater = null;
    }
    if (repeat) {
        repeater = setInterval(func, repeat);
    }
    func();
}

function make_picker(func, repeat) {
    return function(event) {
        return pick(func, repeat);
    };
}

function pick_daily() {
    var date = $("#daily-date").data("DateTimePicker").getDate();

    var start = Math.floor(date / 1000);
    var end = start + DAY_SECONDS;
    fetch_graph(create_url(start, end));
}

function pick_range() {
    var startDate = $("#range-start").data("DateTimePicker").getDate();
    var endDate = $("#range-end").data("DateTimePicker").getDate();

    var start = Math.floor(startDate / 1000);
    var end = Math.floor(endDate / 1000);

    fetch_graph(create_url(start, end));
}

function pick_live() {
    var end = Math.floor(Date.now() / 1000);
    var start = end - HOUR_SECONDS;
    fetch_graph(create_url(start, end));
}

function bar() {
    var end = Math.floor((Date.now() / 1000)/DAY_SECONDS)*DAY_SECONDS;
    var start = end - DAY_SECONDS*8;
    var gran = DAY_SECONDS;
    
    fetch_aggregate([create_url(start, end, gran, "Panel1"),
             create_url(start, end, gran, "Panel2"),
             create_url(start, end, gran, "Panel3")],
             generate_bar_graph);
    
}

function gauge() {
    var end = Math.floor(Date.now() / 1000 - 60)
    var start = end - 60;
    var gran = 10;
    
    fetch_aggregate([create_url(start, end, gran, "Panel1"),
             create_url(start, end, gran, "Panel2"),
             create_url(start, end, gran, "Panel3")],
             generate_gauge);
    
}

function fetch_aggregate(urls, callback, seperate) {
    if (!seperate) seperate = false;
    var responses = [];
    var reqs = [];
    
    var onCompleted = function() {
        for (var i = 0; i < urls.length; i++) {
            if (responses[i] == null) return;
        }
        if (seperate) {
            callback(responses);
        } else {
            var dat = JSON.parse(responses[0]).data;
            for (var i = 1; i < responses.length; i++) {
                var new_dat = JSON.parse(responses[i]).data;
                for (var j = 0; j < dat.length; j++) {
                    dat[j].energy = +dat[j].energy + +new_dat[j].energy;
                }
            }
            callback({data: dat});
        }
    };
    
    var onFailed = function() {
        console.log("it broke");
    };
    
    for (var i = 0; i < urls.length; i++) {
        responses[i] = null;
    }
    for (var i = 0; i < urls.length; i++) {
        var request = new XMLHttpRequest();
        request.seads_index = i;
        request.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status == 200) { //200 OK
                        if (responses[this.seads_index] == null) {
                            responses[this.seads_index] = this.responseText;
                            onCompleted();
                        }
                    } else {
                        onFailed();
                    }
                }
        };

        request.open("GET", urls[i], true);
        request.send();
    }
}

function fetch_graph(url) {
    //Split url by '=' symbol to isolate granularity value, which always becomes 7th element 
    var splitUrl = url.split("=");
    var gran = splitUrl[6];
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200) { //200 OK
                generate_chart(JSON.parse(request.responseText), gran);
            } else {
                console.log("it broke");
            }
        }
    };

    request.open("GET", url, true);
    request.send();
}

function fetch_bar_graph(url) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200) { //200 OK
                generate_bar_graph(JSON.parse(request.responseText));
            } else {
                console.log("it broke");
            }
        }
    };

    request.open("GET", url, true);
    request.send();
}

function generate_gauge(data) {
    var length = data.data.length;
    var gauge = c3.generate({
        padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        bindto: '#gauge',
        data: {
            columns: [
                ['data'].concat(Math.round((data.data[length-1].energy*360) * 1000) / 1000)
            ],
            type: 'gauge',
        },
        gauge: {
           label: {
               format: function(value, ratio) {
                   return value;
               },
               show: true // to turn off the min/max labels.
           },
           min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
           max: 10, // 100 is default
           units: ' kW',
           width: 50 // for adjusting arc thickness
        },
        color: {
            pattern: ['60B044', '#F6C600', '#F97600', '#FF0000'], // the three color levels for the percentage values.
            threshold: {
                //unit: 'value', // percentage is default
                //max: 200, // 100 is default
                values: [10, 20, 50, 100]
            }
        },
        size: {
            height: 200
        }
    });
}

var chart = null;
function generate_chart(data, gran) {
    if (chart == null) {
        chart = c3.generate({
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 50,
            },
            bindto: '#chart',
            data: {
                selection: {
                    enabled: true,
                    draggable: true,
                    grouped: true
                },
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M:%S',
                columns:[ ['x'].concat(data.data.map(function(x){ return x.time; } )), 
                        ['energy'].concat(data.data.map(function(x){
                            var power = ((x.energy * 1000) * (3600 / gran));
                            return Math.round(power * 1000) / 1000; 
                        })) ],
                        types: { energy: 'area', }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M'
                    }
                },
                y: {
                    tick: {
                        format: function(d) {return d + " W";}
                    }
                }
            },
            point: {
                r: 1.5
            }
        });
    } else {
        chart.load({
            columns: [
            ['x'].concat(data.data.map(function(x){ return x.time; })), 
            ['energy'].concat(data.data.map( function(x){
                //convert energy to power by multiplying energy by 3600/granularity  
                var power = ((x.energy * 1000) * (3600/gran));
                return Math.round(power * 1000) / 1000; 
            })) ]
        });
    }
    
    /*-- Deselect points when dragging on graph --*/
    $("#chart").mousedown(function() {
        chart.unselect(['energy']);
    });

    /*-- Invoke modal for labelling --*/
    $("#chart").mouseup(function() {
        var elements = chart.selected('energy');
        if (elements.length === 0) return;

        var start = new Date(elements[0].x); 
        var end = new Date(elements[elements.length - 1].x); 

        $('#myModal').modal('show');

        $("#start-date").datetimepicker({
            format: 'MM/DD/YYYY HH:mm'
        });
        $("#end-date").datetimepicker({
            format: 'MM/DD/YYYY HH:mm'
        });

        $('#start-date').data('DateTimePicker').setDate(start);
        $('#end-date').data('DateTimePicker').setDate(end);
    });
}

function generate_appliance_chart() {
    var chart = c3.generate({
    bindto: '#chart2',
    data: {
        columns: [
            ['data1', 300, 350, 300, 0, 0, 0],
            ['data2', 130, 100, 140, 200, 150, 50]
        ],
        types: {
            data1: 'area',
            data2: 'area-spline'
        }
    }
});
}


$(document).ready(function() {
    //onload

    $(".list-group button").click(function(e) {
        if( $(this).hasClass( "active" ) ) {
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }
    });

    //Live labelling click event
    $("#label-button").click(function(event){
        var pathArray = window.location.pathname.split('/'); // device ID is 3rd entry in url seperatered by a '/'
        var deviceId = pathArray[2];
        window.location.href = "/dashboard/" + deviceId + "/timer/";
    });

    //hide success alert dialogue
    $("#success-alert").hide();
    $("#bad").hide();
    //when radio buttons are changed
    $('input[type=radio][name=panels]').change(function() {
        if (this.value == 'Panel1') {
            pick_live();
        } else if (this.value == 'Panel2') {
            pick_live();
        } else if (this.value == 'Panel3') {
            pick_live();
        }
    });

    /*-- Initialize datepickers and buttons --*/
    $("#live-button").on("click", make_picker(pick_live, 60 * 1000));

    $("#modal-close").on("click", function() {
        $('#myModal').modal('toggle');
        $("#bad").hide();
        $("#label-name").val('');
    });

    $("#daily-date").datetimepicker({
        format: 'MM/DD/YYYY'
    });

    $("#daily-date").on("dp.change", make_picker(pick_daily));

    var dateNow = new Date();
    $("#range-start").on("dp.change", make_picker(pick_range));
    $("#range-end").on("dp.change", make_picker(pick_range));

    $("#range-start").datetimepicker({
        format: 'MM/DD/YYYY HH:mm',
    });
    $("#range-end").datetimepicker({
        format: 'MM/DD/YYYY HH:mm',
    });


    $("#event-submit").on("click", function() {
        if ($("#label-name").val() !== '' && $("#start-date").data("DateTimePicker").getDate().unix() !== null && 
                                            $("#end-date").data("DateTimePicker").getDate().unix() !== null) {
            
            var label = {
                start_time: $("#start-date").data("DateTimePicker").getDate().unix(),
                end_time: $("#end-date").data("DateTimePicker").getDate().unix(),
                label: $("#label-name").val()
            };

            post_data_to_server(label);
            $("#label-name").val('');
            $('#myModal').modal('hide');
            $("#success-alert").show();
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
                $("#success-alert").hide();
            });
            $("#bad").hide();
        } else {
            $("#bad").show();
        }

    });

    pick(pick_live, 10 * 1000);

    fetch_pie();

    gauge();

    bar();

    generate_appliance_chart();

});
