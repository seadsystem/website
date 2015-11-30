$('label[for="from"]').hide();
$('label[for="to"]').hide();
$('#from').hide();
$('#to').hide();
$('.Panel').hide();
$('.Panel_Daily').hide();

$('#daily').hide();
$('#continuous').hide();

var daily = false;
var continuous = false;

function Start() {
    $('label[for="from"]').hide(500);
    $('label[for="to"]').hide(500);
    $('#from').hide(500);
    $('#to').hide(500);
    $('.Panel').hide();
    $('.Panel_Daily').hide();
    $('#DateRange').hide(500);
    $('#DateRangeCont').hide(500);

    $('#daily').hide(500);
    $('#continuous').hide(500);
    $('#daily').show(500);
    $('#continuous').show(500);

    var svg = d3.select("body");
    svg.selectAll("svg").remove();

    daily = false;
    continuous = false;

}

function Update_Daily_Graph(panel) {

    var start = getStart();
    var end = getEnd();

    if (panel == 1)
        var url_cons = getEnergyUrl(start, end, "Panel1", 86400);
    else if (panel == 2)
        var url_cons = getEnergyUrl(start, end, "Panel1", 86400);
    else if (panel == 3)
        var url_cons = getEnergyUrl(start, end, "Panel1", 86400);

    var url_gen = Get_Generated_Daily();

    var margin = {top: 20, right: 20, bottom: 70, left: 40},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y-%m-%d"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var use_tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Power Consumed:</strong> <span style='color:red'>" + d.cons + " kW</span>";
        })

    var gen_tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Power Generated:</strong> <span style='color:red'>" + d.gen + " kW</span>";
        })

    d3.select("svg")
        .remove();

    svg.call(use_tip);
    svg.call(gen_tip);

    d3.json(url_gen, function (error, data_gen) {
        d3.json(url_cons, function (error, data_cons) {
            data_gen.data.reverse();
            data_cons.data.reverse();
            data_gen.data.forEach(function (d) {
                d.date_gen = parseDate(d.time);
                d.gen = +d.energy;
            });
            data_cons.data.forEach(function (d) {
                d.date_cons = parseDate(d.time);
                d.cons = +d.energy;
            });

            x.domain(data_gen.data.map(function (d) {
                return d.date_gen;
            }));
            y.domain([0, d3.max(data_gen.data, function (d) {
                return d.gen;
            })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-90)");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("kW-");

            var gen_bars = svg.selectAll(".gen_rect")
                .data(data_gen.data, function (d) {
                    return d.date_gen;
                });
            gen_bars.enter()
                .append("rect")
                .style("fill", "steelblue")
                .attr("x", function (d) {
                    return x(d.date_gen);
                })
                .attr("y", function (d) {
                    return y(d.gen)
                })
                .attr("width", x.rangeBand())
                .attr("height", function (d) {
                    return height - y(d.gen)
                });

            //Update rectangles
            gen_bars.transition()
                .duration(1000)
                .attr("x", function (d) {
                    return x(d.date_gen);
                })
                .attr("y", function (d) {
                    return y(d.gen)
                })
                .attr("width", x.rangeBand() / 2)
                .attr("height", function (d) {
                    return height - y(d.gen)
                });

            //Exit rectangles
            gen_bars.exit()
                .transition()
                .duration(500)
                .attr("x", width)
                .remove();

            var cons_bars = svg.selectAll(".cons_rect")
                .data(data_cons.data, function (d) {
                    return d.date_cons;
                });
            cons_bars.enter()
                .append("rect")
                .style("fill", "red")
                .attr("x", function (d) {
                    return x(d.date_cons) + x.rangeBand() / 2;
                })
                .attr("y", function (d) {
                    return y(d.cons)
                })
                .attr("width", x.rangeBand() / 2)
                .attr("height", function (d) {
                    return height - y(d.cons)
                });

            //Update rectangles
            cons_bars.transition()
                .duration(1000)
                .attr("x", function (d) {
                    return x(d.date_cons) + x.rangeBand() / 2;
                })
                .attr("y", function (d) {
                    return y(d.cons)
                })
                .attr("width", x.rangeBand() / 2)
                .attr("height", function (d) {
                    return height - y(d.cons)
                });

            //Exit rectangles
            cons_bars.exit()
                .transition()
                .duration(500)
                .attr("x", width)
                .remove();

            svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("text-decoration", "underline")
                .text("Daily Energy Usage (Panel " + panel + ")");

        });
    });
}

function Update_Continuous_Graph(panel) {
    var start = getStart();
    var end = getEnd();

    if (panel == 1)
        var url = getEnergyUrl(start, end, "Panel1", 60);
    else if (panel == 2)
        var url = getEnergyUrl(start, end, "Panel2", 60);
    else if (panel == 3)
        var url = getEnergyUrl(start, end, "Panel3", 60);


    var margin = {top: 20, right: 20, bottom: 50, left: 50},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.cons);
        });


    d3.json(url, function (error, data) {
        data.data.forEach(function (d) {
            d.date = parseDate(d.time);
            d.cons = +d.energy;
        });

        y.domain([d3.min(data.data, function (d) {
            return d.cons;
        }) - 0.01, d3.max(data.data, function (d) {
            return d.cons;
        }) + 0.01]);
        x.domain(d3.extent(data.data, function (d) {
            return d.date;
        }));

        var svg = d3.select("body").transition();

        svg.select(".line")
            .duration(1000)
            .attr("d", line(data.data));
        svg.select(".x.axis")
            .duration(1000)
            .call(xAxis);
        svg.select(".y.axis")
            .duration(1000)
            .call(yAxis);
        svg.select(".title")
            .text("Energy Usage over Time (Panel " + panel + ")");
    });
}

function Daily() {
    if (daily == false || continuous == true) {
        $('label[for="from"]').show(500);
        $('label[for="to"]').show(500);
        $('#from').show(500);
        $('#to').show(500);
        $('.Panel').hide();
        $('.Panel_Daily').show(500);

        var svg = d3.select("body");
        svg.selectAll("svg").remove();

        daily = true;
        continuous = false;

        var url_gen = "http://db.sead.systems:8080/466419817?start_time=1446537600&end_time=1446796800&list_format=energy&type=P&device=PowerS&granularity=86400";
        var url_p1 = "http://db.sead.systems:8080/466419817?start_time=1446537600&end_time=1446796800&list_format=energy&type=P&device=Panel1&granularity=86400";

        var margin = {top: 20, right: 20, bottom: 70, left: 40},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.time.format("%Y-%m-%d"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var use_tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong>Power Consumed:</strong> <span style='color:red'>" + d.cons + " kW</span>";
            })

        var gen_tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong>Power Generated:</strong> <span style='color:red'>" + d.gen + " kW</span>";
            })

        svg.call(use_tip);
        svg.call(gen_tip);

        d3.json(url_gen, function (error, data_gen) {
            d3.json(url_p1, function (error, data_p1) {

                data_gen.data.reverse();
                data_p1.data.reverse();

                data_gen.data.forEach(function (d) {
                    d.date_gen = parseDate(d.time);
                    d.gen = +d.energy;
                });
                data_p1.data.forEach(function (d) {
                    d.date_p1 = parseDate(d.time);
                    d.p1 = +d.energy;
                });

                x.domain(data_gen.data.map(function (d) {
                    return d.date_gen
                }));
                y.domain([0, d3.max(data_gen.data, function (d) {
                    return d.gen;
                })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-90)");

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("kW");

                svg.selectAll("bar")
                    .data(data_gen.data)
                    .enter().append("rect")
                    .attr("class", "gen_rect")
                    .style("fill", "steelblue")
                    .attr("x", function (d) {
                        return x(d.date_gen);
                    })
                    .attr("width", x.rangeBand() / 2)
                    .attr("y", function (d) {
                        return y(d.gen);
                    })
                    .attr("height", function (d) {
                        return height - y(d.gen);
                    })
                    .on('mouseover', gen_tip.show)
                    .on('mouseout', gen_tip.hide);

                svg.selectAll("bar")
                    .data(data_p1.data)
                    .enter().append("rect")
                    .attr("class", "cons_rect")
                    .style("fill", "red")
                    .attr("x", function (d) {
                        return x(d.date_p1) + x.rangeBand() / 2;
                    })
                    .attr("width", x.rangeBand() / 2)
                    .attr("y", function (d) {
                        return y(d.p1);
                    })
                    .attr("height", function (d) {
                        return height - y(d.p1);
                    })
                    .on('mouseover', use_tip.show)
                    .on('mouseout', use_tip.hide);

                svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    .style("text-decoration", "underline")
                    .text("Daily Energy Usage (Panel 1)");
            });
        });
    }
    else {
        $('label[for="from"]').hide(500);
        $('label[for="to"]').hide(500);
        $('#from').hide(500);
        $('#to').hide(500);
        $('.Panel').hide(500);
        $('.Panel_Daily').hide();

        var svg = d3.select("body");
        svg.selectAll("svg").remove();

        daily = false;
        continuous = false;
    }
}

function Continuous() {
    if (continuous == false || daily == true) {
        $('label[for="from"]').show(500);
        $('label[for="to"]').show(500);
        $('#from').hide(500);
        $('#to').hide(500);
        $('#DateRange').hide(500);
        $('#DateRangeCont').show(500);
        $('#from').show(500);
        $('#to').show(500);
        $('.Panel').show(500);
        $('.Panel_Daily').hide();

        var svg = d3.select("body");
        svg.selectAll("svg").remove();

        continuous = true;
        daily = false;

        var url = "http://db.sead.systems:8080/466419817?start_time=1445756400&end_time=1445842800&list_format=energy&type=P&device=Panel1&granularity=60";

        var margin = {top: 20, right: 20, bottom: 50, left: 50},
            width = 800 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.cons);
            });

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.json(url, function (error, data) {
            data.data.forEach(function (d) {
                d.date = parseDate(d.time);
                d.cons = +d.energy;
            });

            y.domain([d3.min(data.data, function (d) {
                return d.cons;
            }) - 0.01, d3.max(data.data, function (d) {
                return d.cons;
            }) + 0.01]);
            x.domain(d3.extent(data.data, function (d) {
                return d.date;
            }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("kW");

            svg.append("path")
                .datum(data.data)
                .attr("class", "line")
                .attr("d", line);

            svg.append("text")
                .attr("class", "title")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2) + 50)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("text-decoration", "underline")
                .text("Energy Usage over Time (Panel 1)");
        });
    }
    else {
        $('label[for="from"]').hide(500);
        $('label[for="to"]').hide(500);
        $('#from').hide(500);
        $('#to').hide(500);
        $('#DateRange').hide(500);
        $('#DateRangeCont').hide(500);
        $('.Panel').hide(500);
        $('.Panel_Daily').hide();

        var svg = d3.select("body");
        svg.selectAll("svg").remove();

        continuous = false;
        daily = false;
    }
}

function getEnergyUrl(start, end, device, granularity) {
    return "http://db.sead.systems:8080/466419817?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=" + device + "&granularity=" + granularity;
}

function Get_Generated() {
    var start = getStart();
    var end = getEnd();
    var url = "http://db.sead.systems:8080/466419817?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=PowerS&granularity=60";
    return url;
}

function Get_Panel1() {
    var start = getStart();
    var end = getEnd();
    var url = "http://db.sead.systems:8080/466419817?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=Panel1&granularity=60";
    return url;
}
function Get_Panel2() {
    var start = getStart();
    var end = getEnd();
    var url = "http://db.sead.systems:8080/466419817?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=Panel2&granularity=60";
    return url;
}
function Get_Panel3() {
    var start = getStart();
    var end = getEnd();
    var url = "http://db.sead.systems:8080/466419817?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=Panel3&granularity=60";
    return url;
}
function Get_Generated_Daily() {
    var start = getStart();
    var end = getEnd();
    var url = "http://db.sead.systems:8080/466419817?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=PowerS&granularity=86400";
    return url;
}

function Get_Panel1_Daily() {
    var start = getStart();
    var end = getEnd();
    var url = "http://db.sead.systems:8080/466419817?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=Panel1&granularity=86400";
    return url;
}
function Get_Panel2_Daily() {
    var start = getStart();
    var end = getEnd();
    var url = "http://db.sead.systems:8080/466419817?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=Panel2&granularity=86400";
    return url;
}
function Get_Panel3_Daily() {
    var start = getStart();
    var end = getEnd();
    var url = "http://db.sead.systems:8080/466419817?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=Panel3&granularity=86400";
    return url;
}

function getStart() {
    var StartDate = $("#from").datepicker("getDate");
    var startunix = Date.parse(StartDate) / 1000;
    return startunix;
}

function getEnd() {
    var EndDate = $("#to").datepicker("getDate");
    var endunix = Date.parse(EndDate) / 1000;
    return endunix;
}

//datepicker widget
$(function () {
    $("#from").datepicker({
        onSelect: function (dateText, inst) {
            var dateAsString = dateText;
            var StartDate = $(this).datepicker('getDate');
        }
    });
    $("#to").datepicker({
        onSelect: function (dateText, inst) {
            var dateAsString = dateText;
            var EndDate = $(this).datepicker('getDate');
        }
    });
});
