
onmessage = function(e) {
    importScripts('//cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    importScripts('../../static/js/fakejquery.js');
    importScripts("http://code.jquery.com/jquery-2.1.4.min.js");
    var workerResult = [];
	var device= e.data[0];
	var deviceid = e.data[1];
	Object.keys(device.rooms).forEach(function (room) {
            Object.keys(device.rooms[room].appliances).forEach(function (appliance) {
                var appl_id = device.rooms[room].appliances[appliance].id;
                workerResult.push(gen_monthly_appl_data(deviceid, appliance, appl_id));
            });
        });
  
  postMessage(workerResult);
}


    // // Generates monthly usage of specified panel for the last 12 months
    // function gen_monthly_appl_data(device_id, appl_name, appl_id, start, end) {
    //     console.log("hi? from gen_monthly, worker");
    //     var result = [];

    //     var points = [];
    //     // var start = moment.subtract(12, "months").startOf("month");
    //     // var end = moment.subtract(5, "minutes");
    //     var time;
    //     for (var i = 0; i <= 12; i++) {
    //         time = Math.floor(start / 1000);
    //         $.ajax({
    //             url: "http://db.sead.systems:8080/" + device_id + "?start_time=" + time + "&end_time=" + time + "&device=" + appl_id + "&type=P",
    //             dataType: 'json',
    //             async: false,
    //             success: function (data_test) {
    //                 points.push(data_test[1]);
    //             }
    //         });
    //         if (i >= 11)
    //             start = end;
    //         else
    //             start.add(1, "month");
    //     }

    //     for (var i = 1; i < points.length; i++) {
    //         if (points[i] !== undefined && points[i - 1] !== undefined) {
    //             result.push(
    //                 Math.abs((points[i - 1][1] - points[i][1]) / 3600000)
    //             )
    //         } else
    //             result.push(null);
    //     }
    //     return result;
    // }


function gen_monthly_appl_data(device_id, appl_name, appl_id) {
        // console.log("entered gen_monthly_appl_data=============================");
        var result = [];
        var points = [];
        var start = moment().subtract(12, "months").startOf("month");
        var end = moment().subtract(5, "minutes");
        var time;
        for (var i = 0; i <= 12; i++) {
            time = Math.floor(start / 1000);
            // console.log("http://db.sead.systems:8080/" + device_id + "?start_time=" + time + "&end_time=" + time + "&device=" + appl_id + "&type=P");
            $.ajax({
                url: "http://db.sead.systems:8080/" + device_id + "?start_time=" + time + "&end_time=" + time + "&device=" + appl_id + "&type=P",
                dataType: 'json',
                async: false,
                success: function (data_test) {
                    points.push(data_test[1]);
                }
            });
            if (i >= 11)
                start = end;
            else
                start.add(1, "month");
        }
        // console.log(points);

        for (var i = 1; i < points.length; i++) {
            if (points[i] !== undefined && points[i - 1] !== undefined) {
                result.push(
                    Math.abs((points[i - 1][1] - points[i][1]) / 3600000)
                )
            } else
                result.push(null);
        }
        // console.log("exitting gen_monthly_appl_data=============================");
        return result;
    }