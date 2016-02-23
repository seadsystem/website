"use strict";

var start_time = null;
var end_time = null;

function confirm_modal(start_time, end_time) {

    $('#confirm-modal').modal('toggle');
}

function post_data_to_server(label) {
    console.log("Sending " + JSON.stringify(label));

    var post = new XMLHttpRequest();
    var url = "http://db.sead.systems:8080/-1/label";
    var params = JSON.stringify(label);
    post.open("POST", url, true);

    post.setRequestHeader("Content-type", "application/json");
    post.setRequestHeader("Content-length", params.length);
    post.setRequestHeader("Connection", "close");

    post.onreadystatechange = function() {
        if (post.readyState == XMLHttpRequest.DONE) {
            if (post.status == 200) { //200 OK
                console.log(request.responseText);
            } else {
                console.log("it broke");
            }
        }
    }
    post.send(params);
}

function timer_alert(text) {
    $('#timer-alert').text(text);
    $("#timer-alert").show();
    $("#timer-alert").fadeTo(2000, 500).slideUp(500, function() {
        $("#timer-alert").hide();
    });
}

function reset_button() {
    $('#timer-button').val("Start Timer");
    start_time = null;
    end_time = null;
    $("#label-name").val('')
    $("#bad").hide();
}

$(document).ready(function() { //onload
    $('#timer-alert').hide();
    $("#bad").hide();

    $('#timer-button').click(function() {
        if (start_time == null) {
            start_time = Date.now();
            $('#timer-button').val("Stop Timer");
            timer_alert("Timer is now active!");
        } else if (end_time == null) {
            end_time = Date.now();
            timer_alert("Timer is now stopped.");
            confirm_modal(start_time, end_time);
        }
    });

    $('#cancel-button').click(function() {
        reset_button();
    });

    $("#event-submit").on("click", function() {

        if($("#label-name").val() !== '') {
            var label = {
                start: start_time,
                end: end_time,
                name: $("#label-name").val()
            };
            post_data_to_server(label);
            reset_button(); 
            $('#confirm-modal').modal('toggle');
        } else {
            $("#bad").show();
        }
    });
});
