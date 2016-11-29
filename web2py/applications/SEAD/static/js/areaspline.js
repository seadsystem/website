var areaspline = function(rooms, room_i, mod_i) {
    // 1. all rooms
    // 2. room to add graph (Home)
    // 3. module to add graph (0 in Home)
    //needs to be change here
    var room = rooms[room_i];
    var data1 = room.data[1];
    var data2 = room.data[2];


    // $("#" + room.modules[mod_i].el_id).highcharts({
    room.modules[mod_i].chart = Highcharts.chart(room.modules[mod_i].el_id, {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: ''
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            plotBands: [{ // visualize the weekend
                from: 4.5,
                to: 6.5,
                color: 'white'
            }]
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' units'
        },
        credits: {
            enabled: true
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.8
            }
        },
        series: [{
            name: 'Bedroom',
            data: data1
        }, {
            name: 'Living room',
            data: data2
        }]
    });
}
