"use strict";

var c3 = require('c3');

var HOUR_SECONDS = 60*60;
var DAY_SECONDS = HOUR_SECONDS*24;

//var url = "http://db.sead.systems:8080/466419818?start_time=1446537600&end_time=1446624000&list_format=energy&type=P&device=Panel1&granularity=3600";

function create_url(start, end) {
    var num_nodes = 250;
    var granularity = Math.ceil((end-start)/num_nodes);
    //console.log(granularity)
    var pathArray = window.location.pathname.split('/'); // device ID is 3rd entry in url seperatered by a '/'
    var deviceId = pathArray[2];
    return "http://db.sead.systems:8080/" + deviceId + "?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=" + "Panel1" + "&granularity=" + granularity;
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
    //console.log("test");
    
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

var chart1 = null;

function generate_chart(data) {
    c3.generate({
	bindto: '#chart',
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
}

$(document).ready(function() {
    //onload
    $("#live-button").on("click", make_picker(pick_live, 60*1000));

    $("#daily-button").on("click", make_picker(pick_daily));
    $("#daily-date").datepicker();

    $("#range-button").on("click", make_picker(pick_range));
    $("#range-start").datetimepicker();
    $("#range-end").datetimepicker();

    pick(pick_live, 10*1000);
});

