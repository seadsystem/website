var bar = function(room, mod_i, categories, payload, isloading) {
    console.log("in bar=================");
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
                text: 'Electricity (kWh)'
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
        series: payload,
        // exporting: {
        //     buttons: {
        //         customButton: {
        //             x: 0,
        //             onclick: function() {
        //                 this.update({
        //                     chart: {
        //                         inverted: false,
        //                         polar: false,
        //                     },
        //                     subtitle: {}
        //                 });
        //             },
        //             symbol: 'circle',
        //             text: 'Standard',
        //         },
        //         customButton1: {
        //             x: 0,
        //             y: 30,
        //             onclick: function() {
        //                 this.update({
        //                     chart: {
        //                         inverted: true,
        //                         polar: false,
        //                     },
        //                     subtitle: {}
        //                 });
        //             },
        //             symbol: 'circle',
        //             text: 'Inverted',
        //         },
        //         customButton2: {
        //             x: 0,
        //             y: 60,
        //             onclick: function() {
        //                 this.update({
        //                     chart: {
        //                         inverted: false,
        //                         polar: true,
        //                     },
        //                     subtitle: {}
        //                 });
        //             },
        //             symbol: 'circle',
        //             text: 'Polar',
        //         },
        //     }
        //
        // }
    });
    if(isloading) {
        room.modules[mod_i].chart.showLoading();
    }
}
