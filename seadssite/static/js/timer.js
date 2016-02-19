"use strict";

var start_time = null;
var end_time = null;

function confirm_modal(start_time, end_time) {

    $('#confirm-modal').modal('toggle');
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
            reset_button(); 
            $('#confirm-modal').modal('toggle');
        } else {
            $("#bad").show();
        }
    });
});
