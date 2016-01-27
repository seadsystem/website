"use strict";

var c3 = require('c3');

//var url = "http://db.sead.systems:8080/466419818?start_time=1446537600&end_time=1446624000&list_format=energy&type=P&device=Panel1&granularity=3600";

function create_url(date) {
    if (!date) {
        date = Date.now();
        var end = Math.floor(date / 1000);
        var start = end - 86400;
    } else {
        var start = Math.floor(date / 1000);
        var end = start + 86400;
    }
    return "http://db.sead.systems:8080/" + "466419818" + "?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=" + "Panel1" + "&granularity=" + "3600";
 
}

function date_picker(event) {
    var date = $("#datepicker").datepicker("getDate");
    get_graph_data(create_url(date));
}


function get_graph_data(url) {
    var test_request = new XMLHttpRequest();
    test_request.onreadystatechange = function() {
        //console.log(test_request.readyState);
        if (test_request.readyState == XMLHttpRequest.DONE) {
            if (test_request.status == 200) {
                //console.log(test_request.responseText);
                generate_day_chart(JSON.parse(test_request.responseText));
            } else {
                console.log("it broke");
            }
        }
    };


    test_request.open("GET", url, true);
    test_request.send();
}

var chart1 = null;

function generate_day_chart(data) {
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

            ['energy (kW)'].concat(data.data.map(
                function(x) {
                    return x.energy;
                }
            ))
        ]
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
    $("#daily_button").on("click", date_picker);
    $("#datepicker").datepicker()
    get_graph_data(create_url());
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

