var areaspline = function (room, mod_i) {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    room.modules[mod_i].chart = Highcharts.chart(room.modules[mod_i].el_id, {
        chart: {
            type: 'areaspline',
            zoomType: 'x'
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
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%b %e',
                hour: '%I:%M'
            }
        },
        yAxis: {
            title: {
                text: 'kWh'
            },
        },
        tooltip: {
            valueSuffix: ' kWh',
            //valueDecimals: 3,
            shared: true
        },
        credits: {
            enabled: true
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.6
            }
        },
        series: {}
    });
    room.modules[mod_i].chart.showLoading();
}
