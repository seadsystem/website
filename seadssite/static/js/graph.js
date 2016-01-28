"use strict";

var c3 = require('c3');

var DAY_SECONDS = 60*60*24;

//var url = "http://db.sead.systems:8080/466419818?start_time=1446537600&end_time=1446624000&list_format=energy&type=P&device=Panel1&granularity=3600";

function create_url(start, end) {
    var num_nodes = 250;
    var granularity = Math.ceil((end-start)/num_nodes);
    //console.log(granularity)
    return "http://db.sead.systems:8080/" + "466419818" + "?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=" + "Panel1" + "&granularity=" + granularity;
}

function pick_daily(event) {
    var date = $("#daily-date").datepicker("getDate");

    var start = Math.floor(date / 1000);
    var end = start + DAY_SECONDS;
    fetch_graph(create_url(start, end));
}

function pick_range(event) {
    var startDate = $("#range-start").data("DateTimePicker").getDate();
    var endDate = $("#range-end").data("DateTimePicker").getDate();

    var start = Math.floor(startDate / 1000);
    var end = Math.floor(endDate / 1000);

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
    $("#daily-button").on("click", pick_daily);
    $("#daily-date").datepicker();

    $("#range-button").on("click", pick_range);
    $("#range-start").datetimepicker();
    $("#range-end").datetimepicker();

    var date = Date.now();
    var end = Math.floor(date / 1000);
    var start = end - DAY_SECONDS;
    fetch_graph(create_url(start, end));
});
//var pie = c3.generate({
//     bindto: '#chart2',
//     data: {
//         // iris data from R
//         columns: [
//             ['data1', 30],
//             ['data2', 120],
//         ],
//         type : 'pie',
//         onclick: function (d, i) { console.log("onclick", d, i); },
//         onmouseover: function (d, i) { console.log("onmouseover", d, i); },
//         onmouseout: function (d, i) { console.log("onmouseout", d, i); }
//     }
// });



// function generate_chart(data) {
//     //console.log(data.data);
//     c3.generate({
//         data: {
//             json: [
//                data.data
//             ],
//             keys: {
//                 // x: 'name', // it's possible to specify 'x' when category axis
//                 value: ['energy', 'time'],
//             }
//         },
//         axis: {
//             x: {
//                 type: 'timeseries',
//                 tick: {
//                     // this also works for non timeseries data
//                     values: ['2013-01-05', '2013-01-10']
//                 }
//             }
//         }
//     });
// }

