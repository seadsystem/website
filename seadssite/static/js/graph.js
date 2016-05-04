"use strict";

var c3 = require('c3');

var HOUR_SECONDS = 60 * 60;
var DAY_SECONDS = HOUR_SECONDS * 24;

var GREEN = '#60B044';
var YELLOW = '#F6C600';
var ORANGE = '#F97600';
var RED = '#FF0000';


function generate_pie_graph(responses) {
    var data = [];
    var res = [];
    for (var i = 0; i < responses.length; i++) {
        if(typeof (res[i] = JSON.parse(responses[i]).data[0]) != 'undefined') {
            data[i] = ['Panel' + (i+1), res[i].energy];
        } else {
            data = [];
            break;
        }
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
            colors: {
                    Panel1: '#1f77b4',
                    Panel2: '#FFC51E',
                    Panel3: '#FF5B1E'
                },
            empty: { label: { text: "No Data Available" }   },
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
            left: 70,
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
            empty: { label: { text: "No Data Available" }   },
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

function pick_daily(panels) {
    var date = $("#daily-date").data("DateTimePicker").getDate();
    var start = Math.floor(date / 1000);
    var end = start + DAY_SECONDS;
    var gran = 0;
    var urls = [];
    for(var i = 0; i < panels.length; i++) {
        urls[i] = create_url(start, end, gran, panels[i]);
    }
    fetch_aggregate(urls, generate_chart, true, panels);
}

function pick_range(panels) {
    var startDate = $("#range-start").data("DateTimePicker").getDate();
    var endDate = $("#range-end").data("DateTimePicker").getDate();

    var start = Math.floor(startDate / 1000);
    var end = Math.floor(endDate / 1000);
    var gran = 0;
    var urls = [];
    for(var i = 0; i < panels.length; i++) {
        urls[i] = create_url(start, end, gran, panels[i]);
    }
    fetch_aggregate(urls, generate_chart, true, panels);
}

function pick_live(panels) {
    var end = Math.floor(Date.now() / 1000);
    var start = end - HOUR_SECONDS;
    var gran = 0;
    var urls = [];
    for(var i = 0; i < panels.length; i++) {
        urls[i] = create_url(start, end, gran, panels[i]);
    }
    fetch_aggregate(urls, generate_chart, true, panels);
}


function fetch_aggregate(urls, callback, seperate, panels) {
    if (!seperate) seperate = false;
    var responses = [];
    var reqs = [];
    var splitUrl = urls[0].split("=");
    var gran = splitUrl[6];
    
    var onCompleted = function() {
        for (var i = 0; i < urls.length; i++) {
            if (responses[i] == null) return;
        }
        if (seperate) {
            if(callback == generate_chart) {
                callback(responses, gran, panels);
            } else {
                callback(responses);
            }
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
    if (typeof data.data[0] != 'undefined') {
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
                    ['data'].concat(Math.round((data.data[0].energy*360) * 1000) / 1000)
                ],
                type: 'gauge',
                empty: { label: { text: "No Data Available" }   },
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
                pattern: [GREEN, YELLOW, ORANGE, RED], // the three color levels for the percentage values.
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
    } else {
        var gauge = c3.generate({
            padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            bindto: '#gauge',
            data: {
                columns: ['error', 0],
                type: 'gauge',
            },
            gauge: {
               label: {
                   format: function(value, ratio) {
                       return "0";
                   },
                   show: true // to turn off the min/max labels.
               },
               min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
               max: 10, // 100 is default
               width: 50 // for adjusting arc thickness
            },
            color: {
                pattern: [GREEN, YELLOW, ORANGE, RED], // the three color levels for the percentage values.
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
}

var chart = null;
function generate_chart(responses, gran, panels) {
    var res = [];
    var data = [];
    for (var i = 0; i < responses.length; i++) {
        res[i] = JSON.parse(responses[i]);
        data[i+1] = [panels[i]].concat(res[i].data.map(function(x){
                            var power = ((x.energy * 1000) * (3600 / gran));
                            return Math.round(power * 1000) / 1000; 
                        }));
        if(i==0) {
            data[0] = ['x'].concat(res[0].data.map(function(x){ return x.time; } ));
        }
    }
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
                // selection: {
                //     enabled: true,
                //     draggable: true,
                //     grouped: true
                // },
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M:%S',
                columns:data,
                types: { 
                    Panel1: 'area',
                    Panel2: 'area',
                    Panel3: 'area',
                    PowerS: 'area',
                }, 
                colors: {
                    Panel1: '#1f77b4',
                    Panel2: '#FFC51E',
                    Panel3: '#FF5B1E',
                    PowerS: '#2ca02c'
                },
                empty: { label: { text: "No Data Available" }   },
            },
            zoom: {
                enabled: true
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m-%d %H:%M'
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
            columns:data,
            unload: chart.columns
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

    $('#Panel1').addClass("active");
    $('#Panel2').addClass("active");
    $('#Panel3').addClass("active");

    $("#panels button").click(function(e) {
        var count = 0;
        $('#panels .active').each(function() {
            count++;
        });

        var i = 0;
        var panels = [];
        if(count > 1) {
            if($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).blur();
                $('#panels .active').each(function(){
                    panels[i]= $(this).attr('id'); 
                    i++;
                }); 
                pick_daily(panels);
            } else {
                $(this).addClass("active");
                $('#panels .active').each(function(){
                    panels[i]= $(this).attr('id'); 
                    i++;
                }); 
                pick_daily(panels);
            }
        } else {
            if(!$(this).hasClass("active")) {
                $(this).addClass("active");
                $('#panels .active').each(function(){
                    panels[i]= $(this).attr('id'); 
                    i++;
                }); 
                pick_daily(panels);
            }
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

    $("#daily-date").on("dp.change", function(){
        var panels = [];
        var i = 0;
        $('#panels .active').each(function(){
            panels[i]= $(this).attr('id'); 
            i++;
        }); 
        pick_daily(panels);
    });

    $("#range-start").on("dp.change", function(){
        var panels = [];
        var i = 0;
        $('#panels .active').each(function(){
            panels[i]= $(this).attr('id'); 
            i++;
        }); 
        pick_range(panels);
    });

    $("#range-end").on("dp.change", function(){
        var panels = [];
        var i = 0;
        $('#panels .active').each(function(){
            panels[i]= $(this).attr('id'); 
            i++;
        }); 
        pick_range(panels);
    });

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

    pick_daily(['Panel1', 'Panel2', 'Panel3']);

    var dateNow = Date.now();
    var end;
    var start;
    var gran;

    //fetch pie graph
    end = Math.floor(dateNow / 1000);
    start = end - DAY_SECONDS*2;
    gran = DAY_SECONDS;
    
    fetch_aggregate([create_url(start, end, gran, "Panel1"),
             create_url(start, end, gran, "Panel2"),
             create_url(start, end, gran, "Panel3")],
             generate_pie_graph, true);


    //fetch gauge graph
    end = Math.floor(dateNow / 1000)
    start = end - DAY_SECONDS/4;
    gran = 1;
    
    fetch_aggregate([create_url(start, end, gran, "Panel1"),
             create_url(start, end, gran, "Panel2"),
             create_url(start, end, gran, "Panel3")],
             generate_gauge);

    //getch bar graph
    end = Math.floor((dateNow / 1000)/DAY_SECONDS)*DAY_SECONDS;
    start = end - DAY_SECONDS*8;
    gran = DAY_SECONDS;
    
    fetch_aggregate([create_url(start, end, gran, "Panel1"),
             create_url(start, end, gran, "Panel2"),
             create_url(start, end, gran, "Panel3")],
             generate_bar_graph);


    generate_appliance_chart();

});
