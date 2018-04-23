var areaspline = function(rooms, room_i, mod_i,payload) {
    // 1. all rooms
    // 2. room to add graph (Home)
    // 3. module to add graph (0 in Home)
    //needs to be change here
    var dates = []
    var datum = []
    for (var i = 0;i < payload.length;i++)  {
        dates.push(payload[i].date)
        datum.push(payload[i].data)
    }

    var room = rooms[room_i];

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
            categories: dates,
            plotBands: [{ // visualize the weekend
                from: 4.5,
                to: 6.5,
                color: 'white'
            }]
        },
        yAxis: {
            title: {
                text: 'kWh'
            },
        },
        tooltip: {
            shared: true,
            valueSuffix: ' killowatt hour(s)'
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
        name : "Appliace1",
        data : datum
    }
    , {
        
    }]
    });
}
