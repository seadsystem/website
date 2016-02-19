"use strict";

var start_time = null;
var end_time = null;

function confirm_modal(start_time, end_time) {
    //console.log("" + start_time + " " + end_time);
    
    $('#confirm-modal').modal('toggle');
}

function post_data_to_server(label) {
    console.log(label);
}

function timer_alert(text) {
    $('#timer-alert').text(text);
    $("#timer-alert").show();
    $("#timer-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#timer-alert").hide();
    }); 
}

function reset_button() {
    $('#butt').val("Start Timer");
    start_time = null;
    end_time = null;
}

$(document).ready(function() { //onload
    $('#timer-alert').hide();

    $('#butt').click(function() {
	if (start_time == null) {
	    start_time = Date.now();
	    $('#butt').val("Stop Timer");
	    timer_alert("Timer is now active!");
	} else if (end_time == null) {
	    end_time = Date.now();
	    timer_alert("Timer is now stopped.");
	    confirm_modal(start_time, end_time);
	}
    });

    $('#cancel-butt').click(function() {
	reset_button();
    });

    $("#event-submit").on("click", function() {
        var label = {
            start: start_time,
            end: end_time,
            name: $("#label-name").val()
        };

        //validate data is sane

        post_data_to_server(label);

	reset_button();
        $('#confirm-modal').modal('toggle');
    });
});
