function validation(){
	$("#deviceIDNumError").hide();
	$("#deviceIDEmpty").hide();
	$("#deviceNameEmpty").hide();
	var deviceID = $("#device_id").val();
	if (isNaN(deviceID)){
		//alert("not a number");
		$("#deviceIDNumError").show();
		return false;
	}
	if(!$("#device_id").val()){
		$("#deviceIDEmpty").show();
		return false;
	}
	if(!$("#device_name").val()){
		$("#deviceNameEmpty").show();
		return false;	
	}
	else{
		$("#deviceRegisterSubmit").click();
	}
}

$("#device_id, #device_name").keypress(function(e){ 
	if(e.which == 13) {
		e.preventDefault();
		validation();
	}
});

function get_api_data(device_id) {
  $.get("", {device_id:device_id}, function(data) {
    console.log(data);
    });
}

$(document).ready(function(){
	$(".delete").click(function(event){
	  event.stopPropagation();
	});
	$(".deviceBox").click(function(event){
		var device_id = $(this).find(".device_id").val();
	  window.location.href = "/visualization/"+device_id;
	});
});

$( ".col-md-3 .registerDevice" ).mouseover(function() {
  console.log("mouseover event detected.");
});  