// This should be refactored into an object. 
// The applianceSort module should have some sort of onload mechanism that instantiates 
// this refactored object. 
// After that eventlisteners should be added to the dom elements instead of using inline js
// in the injected html for the module. 
// Due to time constraints we won't do this. 

var column; // reference to the dom element we will attach the appliance to
var curObject; // stores current appliance we're working with
var curRoom; // stores current room we're moving the appliance from
var curDevice;
function applianceSortDragged(ev) {
    curObject = ev.target.id;
    curRoom = ev.target.parentNode.id;
    console.log(ev.target.parentNode.id);
    console.log("in dragged");
    console.log(this);
    console.log(ev.target.id);
    ev.dataTransfer.setData(curObject, ev.target.id);
}
// stops the default dialog when you drag drop inappropriately
function applianceSortAllowDrop(ev) {
    ev.preventDefault();
}
function applianceSortDrop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData(curObject);

    console.log("ev.target");
    console.log(ev.target.id);
    console.log("document.getElementById(data)");
    console.log(document.getElementById(data).id);
    column.appendChild(document.getElementById(data));
    // test ajax
    $.ajax({
        type: "GET",
        url: "/dashboard_test/sort",
        data: { 
            targetRoom: ev.target.id,
            targetAppliance: document.getElementById(data).id,
            currentRoom: curRoom,
            currentDevice: curDevice
        }
        }).done(function( o ) {
        console.log("post made");
    });
}
