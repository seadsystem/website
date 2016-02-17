"use strict";

var c3 = require('c3');

var HOUR_SECONDS = 60*60;
var DAY_SECONDS = HOUR_SECONDS*24;

//var url = "http://db.sead.systems:8080/466419818?start_time=1446537600&end_time=1446624000&list_format=energy&type=P&device=Panel1&granularity=3600";


function pie() {
    c3.generate({
        bindto: '#pie',
        data: {
            // iris data from R
            columns: [
                ['data1', 30],
                ['data2', 120],
            ],
            type : 'pie',
        }
    });    
}


function bar(data) { 
    c3.generate({
        padding: {
            top: 40,
            right: 100,
            bottom: 0,
            left: 100,
        },
        bindto: '#bar',
        data: {
            x: 'x',
            xFormat: '%Y-%m-%d %H:%M:%S', 
            columns: [
            ['x'].concat(data.data.map(
                    function(x) {
            return x.time;
                    }
            )),
            ['energy'].concat(data.data.map(
                    function(x) {
                return x.energy;
                    }
            ))
        ],
        type: 'bar'
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    // displays day of week
                    format: '%a'
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

function update_graph() {

}

function create_url(start, end) {
    var num_nodes = 150;
    var granularity = Math.ceil((end-start)/num_nodes);
    //console.log(granularity)
    var pathArray = window.location.pathname.split('/'); // device ID is 3rd entry in url seperatered by a '/'
    var deviceId = pathArray[2];
    var panel = $('input[type=radio][name=panels]:checked').val();
    return "http://db.sead.systems:8080/" + deviceId + "?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=" + panel + "&granularity=" + granularity;
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
    return function(event) {return pick(func, repeat);};
}

function pick_daily() {
    var date = $("#daily-date").datepicker("getDate");

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
    var end = Math.floor(Date.now()/1000);
    var start = end - HOUR_SECONDS;
    fetch_graph(create_url(start, end));
}

function fetch_graph(url) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        //console.log(request.readyState);
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200) { //200 OK
                //console.log(request.responseText);
                generate_chart(JSON.parse(request.responseText));
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
        //console.log(request.readyState);
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200) { //200 OK
                //console.log(request.responseText);
                bar(JSON.parse(request.responseText));
            } else {
                console.log("it broke");
            }
        }
    };

    request.open("GET", url, true);
    request.send();
}

var chart1 = null;

function generate_chart(data) {
    var chart = c3.generate({
        padding: {
            top: 0,
            right: 100,
            bottom: 0,
            left: 100,
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
                columns: [
    		['x'].concat(data.data.map(
                        function(x) {
    			             return x.time;
                        }
    		)),
    		['energy'].concat(data.data.map(
                        function(x) {
    			             return x.energy;
                        }
    		))
                ], 
                types: {
                    energy: 'area',
                }
    	},
    	axis: {
            x: {
                type: 'timeseries',
                tick: {
                    // this also works for non timeseries data
                    format: '%H:%M'
                }
            }
        }    
    });

    $("#chart").mousedown(function() {
        chart.unselect(['energy']);
    });

    $("#chart").mouseup(function() {
        var elements = chart.selected('energy');
        if (elements.length === 0) return;

        var start = new Date(elements[0].x);//.getTime() / 1000;
        var end = new Date(elements[elements.length - 1].x);//.getTime() / 1000;

        $('#myModal').modal('toggle');

        $("#start-date").datetimepicker();
        $("#end-date").datetimepicker();

        $('#start-date').data('DateTimePicker').setDate(start);
        $('#end-date').data('DateTimePicker').setDate(end);
    });
}

function post_data_to_server(label) {
    //POST
}



$(document).ready(function() {
    //onload

    //when radio buttons are changed
    $('input[type=radio][name=panels]').change(function() {
        if(this.value == 'Panel1') {
            pick_live();  
        } else if(this.value == 'Panel2') {
            pick_live();
        } else if(this.value == 'Panel3') {
            pick_live();
        }
    });

    $("#live-button").on("click", make_picker(pick_live, 60*1000));

    $("#daily-button").on("click", make_picker(pick_daily));
    var dateNow = new Date();
    $('#daily-date').datetimepicker({
        defaultDate: dateNow
    });


    $("#range-button").on("click", make_picker(pick_range));
    $("#range-start").datetimepicker({
        defaultDate: dateNow
    });
    $("#range-end").datetimepicker({
        defaultDate: dateNow
    });

    
    $("#event-submit").on("click", function() {
        var label = {
            start: $("#start-date").data("DateTimePicker").getDate().unix(),
            end: $("#end-date").data("DateTimePicker").getDate().unix(),
            name: $("#label-name").val()
        };

        //validate data is sane

        post_data_to_server(label);

        //console.log(label);
        $('#myModal').modal('toggle');


    });


    pick(pick_live, 10*1000);
    pie();

    //Just generating url for weekly energy data here for now as test
    var end = Math.floor(Date.now()/1000);
    var start = end - 691200;
    var url = "http://db.sead.systems:8080/466419818?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=Panel1&granularity=86400";
    fetch_bar_graph(url);
});

