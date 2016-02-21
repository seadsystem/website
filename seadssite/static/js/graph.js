"use strict";

var c3 = require('c3');

var HOUR_SECONDS = 60 * 60;
var DAY_SECONDS = HOUR_SECONDS * 24;


function pie() {
    c3.generate({
        bindto: '#pie',
        data: {
            // iris data from R
            columns: [
                ['data1', 30],
                ['data2', 120],
            ],
            type: 'pie',
        }
    });
}

function generate_bar_graph(data) {
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
                )), ['energy'].concat(data.data.map(
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


function create_url(start, end, gran) {
    if (gran) {
        var granularity = gran;
    } else {
        var num_nodes = 150;
        var granularity = Math.ceil((end - start) / num_nodes);
    }

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
    var end = Math.floor(Date.now() / 1000);
    var start = end - 691200;
    var gran = 86400;
    fetch_bar_graph(create_url(start, end, gran));
}

function fetch_graph(url) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200) { //200 OK
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
                )), ['energy'].concat(data.data.map(
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
                    format: '%H:%M'
                }
            }
        }
    });

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

        $('#myModal').modal('toggle');

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


$(document).ready(function() {
    //onload

    //hide success alert dialogue
    $("#success-alert").hide();
    $("#bad").hide();
    //when radio buttons are changed
    $('input[type=radio][name=panels]').change(function() {
        if (this.value == 'Panel1') {
            pick_live();
            bar();
        } else if (this.value == 'Panel2') {
            pick_live();
            bar();
        } else if (this.value == 'Panel3') {
            pick_live();
            bar();
        }
    });

    /*-- Initialize datepickers and buttons --*/
    $("#live-button").on("click", make_picker(pick_live, 60 * 1000));

    $("#modal-close").on("click", function() {
        $('#myModal').modal('toggle');
        $("#bad").hide();
        $("#label-name").val('');
    });


    $("#daily-button").on("click", make_picker(pick_daily));
    var dateNow = new Date();
    $("#daily-date").datetimepicker({
        format: 'MM/DD/YYYY HH:mm',
        defaultDate: moment(dateNow).hours(0).minutes(0).seconds(0).milliseconds(0)
    });


    $("#range-button").on("click", make_picker(pick_range));
    $("#range-start").datetimepicker({
        format: 'MM/DD/YYYY HH:mm',
        defaultDate: dateNow
    });
    $("#range-end").datetimepicker({
        format: 'MM/DD/YYYY HH:mm',
        defaultDate: dateNow
    });


    $("#event-submit").on("click", function() {
        if ($("#label-name").val() !== '' && $("#start-date").data("DateTimePicker").getDate().unix() !== null && 
                                            $("#end-date").data("DateTimePicker").getDate().unix() !== null) {
            
            var label = {
                start: $("#start-date").data("DateTimePicker").getDate().unix(),
                end: $("#end-date").data("DateTimePicker").getDate().unix(),
                name: $("#label-name").val()
            };

            post_data_to_server(label);
            $("#label-name").val('');
            $('#myModal').modal('toggle');
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

    pie();

    bar();
});
