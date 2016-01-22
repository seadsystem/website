var c3 = require('c3');

var url = "http://db.sead.systems:8080/466419817?start_time=1446537600&end_time=1446796800&list_format=energy&type=P&device=Panel1&granularity=3600";

var test_request = new XMLHttpRequest();
test_request.onreadystatechange = function() {
    //console.log(test_request.readyState);
    if (test_request.readyState == XMLHttpRequest.DONE) {
        if (test_request.status == 200) {
            console.log(test_request.responseText);
            generate_chart1(JSON.parse(test_request.responseText));
        } else {
            console.log("it broke");
        }
    }
};
test_request.open("GET", url, true);
test_request.send();


var pie = c3.generate({
    bindto: '#chart',
    data: {
        // iris data from R
        columns: [
            ['data1', 30],
            ['data2', 120],
        ],
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    }
});


var chart1 = null;

function generate_chart1(data) {
    c3.generate({
    bindto: '#chart2',
    data: {       
        columns: [
            ['data:'].concat(data.data.map(
                function(x) {
                    return x.energy;
                }
            ))
        ]
        }
    });
}






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

