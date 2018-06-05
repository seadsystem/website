var bar = function (room, mod_i) {
    var categories = [];
    var month = moment().month() + 1;
    for (var i = 0; i < 12; i++) {
        categories.push(moment().month(month).format('MMMM'));
        month = (month + 1) % 12;
    }
    room.modules[mod_i].chart = Highcharts.chart(room.modules[mod_i].el_id, {
        chart: {
            type: 'column',
            inverted: false,
        },
        title: {
            text: 'Monthly Usage'
        },
        xAxis: {
            categories: categories,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'kWh'
            }
        },
        tooltip: {
            valueSuffix: ' kWh',
            valueDecimals: 3,
            shared: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: {}
    });
    room.modules[mod_i].chart.showLoading();
}
