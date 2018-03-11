function validation() {
    $("#deviceIDNumError").hide();
    $("#deviceIDEmpty").hide();
    $("#deviceNameEmpty").hide();
    var deviceID = $("#device_id").val();
    if (isNaN(deviceID)) {
        //alert("not a number");
        $("#deviceIDNumError").show();
        return false;
    }
    if (!$("#device_id").val()) {
        $("#deviceIDEmpty").show();
        return false;
    }
    if (!$("#device_name").val()) {
        $("#deviceNameEmpty").show();
        return false;
    }
    else {
        $("#deviceRegisterSubmit").click();
    }
}

$("#btn-confirm").click(function (event) {
    console.log("hello");
    $("#confirm_delete_modal").modal('show');
});

$("#device_id, #device_name").keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        validation();
    }
});

$(document).ready(function () {
    $(".delete").click(function (event) {
        event.stopPropagation();
    });
    $(".deviceBox").click(function (event) {
        event.stopPropagation();
        var device_id = $(this).find(".device_id").val();
        window.location.href = "/dashboard/" + device_id + "/";
    });
});

$(".col-md-3 .registerDevice").mouseover(function () {
    console.log("mouseover event detected.");
});  