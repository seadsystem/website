var bar = function(room, mod_i, categories, payload) {
    room.modules[mod_i].chart = Highcharts.chart(room.modules[mod_i].el_id, {
        chart: {
            type: 'column',
            inverted: false,
        },
        title: {
            text: 'Device Usage'
        },
        subtitle: {
            text: 'Sample Data'
        },
        xAxis: {
            categories: categories,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Electricity (W)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} W</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
}
