var bar = function(room, mod_i, data_i) {

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
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Eletricity (W)'
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
        series: [{
            name: 'TV',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        }, {
            name: 'Light',
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        }, {
            name: 'Ipad',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        }, {
            name: 'AC',
            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

        }],
        exporting: {
            buttons: {
                customButton: {
                    x: 0,
                    onclick: function() {
                        this.update({
                            chart: {
                                inverted: false,
                                polar: false,
                            },
                            subtitle: {}
                        });
                    },
                    symbol: 'circle',
                    text: 'Standard',
                },
                customButton1: {
                    x: 0,
                    y: 30,
                    onclick: function() {
                        this.update({
                            chart: {
                                inverted: true,
                                polar: false,
                            },
                            subtitle: {}
                        });
                    },
                    symbol: 'circle',
                    text: 'Inverted',
                },
                customButton2: {
                    x: 0,
                    y: 60,
                    onclick: function() {
                        this.update({
                            chart: {
                                inverted: false,
                                polar: true,
                            },
                            subtitle: {}
                        });
                    },
                    symbol: 'circle',
                    text: 'Polar',
                },
            }

        }
    });
}
