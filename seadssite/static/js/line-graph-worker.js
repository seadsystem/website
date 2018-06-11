onmessage = function(e) {
    importScripts('//cdn.jsdelivr.net/momentjs/latest/moment.min.js');
    // importScripts('../../static/js/jquery.js');
    importScripts('../../static/js/fakejquery.js');
    importScripts("http://code.jquery.com/jquery-2.1.4.min.js");
  // console.log('Message received from main script');
  console.log(e.data[1]);
  // var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  var workerResult = [];
// delay shit
    // for(var i =0; i<5000000; i++){
    //  workerResult.push(Math.random());
    // }
    var device= e.data[0];
    var deviceid = e.data[1];
    var powerData = e.data[2];
    var startDate = e.data[3];
    var endDate = e.data[4];
    // console.log(start);
    // console.log(end);
    // moment();
    Object.keys(powerData).forEach(function (appl_id) {
        workerResult.push(gen_cont_appl_data(deviceid, powerData[appl_id].name,
            appl_id, startDate, endDate, 30));
    });
  
  console.log('Posting message back to main script');
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


// Generates continous power usage data for the specified parameters
    function gen_cont_appl_data(device_id, name, appliance_id, start, end, data_points) {
        var granularity = Math.floor((end - start) / data_points);

        var result = [];
        $.ajax({
            url: "http://db.sead.systems:8080/" + device_id + "?start_time=" + start + "&end_time=" + end +
            "&list_format=energy&type=P&device=" + appliance_id + "&granularity=" + granularity,
            dataType: 'json',
            async: false,
            success: function (response) {
                result = Object.keys(response.data).reverse().map(function (key) {
                    return [moment(response.data[key]["time"], "YYYY-MM-DD HH:mm:ss").valueOf(), parseFloat(response.data[key]["energy"])];
                })
            }
        });
        return result;
    }