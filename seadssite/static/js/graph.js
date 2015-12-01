/* graph.js
    This file controls the graph.html page, please fix fixmes as you encounter them.

 */




// FIXME: this can all be done with css animations
$('label[for="from"]').hide();
$('label[for="to"]').hide();
$('#from').hide();
$('#to').hide();
$('.Panel').hide();
$('.Panel_Daily').hide();

$('#daily').hide();
$('#continuous').hide();
//-----------------------------------------------


// FIXME theres probably a better alternative to globals
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


/* FIXME: this can be combined with Update_Continuous_Graph(), Daily(), and Continuous() for more readability and more code
   resuse */
function Update_Daily_Graph(panel) {

    var start = getStart();
    var end = getEnd();

    if (panel == 1)
        var url_cons = getEnergyUrl(start, end, "Panel1", 86400);
    else if (panel == 2)
        var url_cons = getEnergyUrl(start, end, "Panel1", 86400);
    else if (panel == 3)
        var url_cons = getEnergyUrl(start, end, "Panel1", 86400);

    var url_gen = getEnergyUrl(start, end, "PowerS", 86400);

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

/* FIXME: this can be combined with Update_Daily_Graph(), Daily(), and Continuous() for more readability and code
   reuse */

function getEvents(panel){

  var svg = d3.select("body");
  svg.select("#EventLine").remove();

  var start = getStart();
  var end = getEnd();

  if (panel == 1){
      var url = getEventUrl(start, end, "Panel1");
        }
  else if (panel == 2){
      var url = getEventUrl(start, end, "Panel2");
        }
  else if (panel == 3){
      var url = getEventUrl(start, end, "Panel3");
        }

  var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

  var margin = {top: 20, right: 20, bottom: 50, left: 50},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);


  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%Y-%m-%d"));

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select("g");

  var line = d3.svg.line()
      .x(function(d){
        return x(d.date);
      })
      .y(function (d) {
          return y(d.val);
      });

  d3.json(url, function (error, data) {
      data.data.reverse();
      data.data.forEach(function (d) {
          d.date = parseDate(d.time);
          d.val = +d.event;
      });

      var scale = d3.scale.linear().domain([0, d3.max(data.data, function(d){ return d.val;})]).range([0, 60]);

      data.data.forEach(function(d){
        d.val = scale(+d.val);
      });

      x.domain(d3.extent(data.data, function(d) { return d.date; }));
      y.domain([d3.min(data.data, function (d) {
          return d.val;
      }) - 0.01, d3.max(data.data, function (d) {
          return d.val;
      }) + 0.01]);

      svg.append("path")
          .datum(data.data)
          .attr("class", "line")
          .attr("id", "EventLine")
          .style("stroke", "red")
          .attr("d", line);

        });

  }

function Update_Continuous_Graph(panel) {
    var start = getStart();
    var end = getEnd();

    if (panel == 1){
        var url = getEnergyUrl(start, end, "Panel1", 60);
        getEvents(1);
          }
    else if (panel == 2){
        var url = getEnergyUrl(start, end, "Panel2", 60);
        getEvents(2);
          }
    else if (panel == 3){
        var url = getEnergyUrl(start, end, "Panel3", 60);
        getEvents(3);
          }
    else if (panel == 4){
      var svg = d3.select("body");
      svg.select("#EventLine").remove();
        var url = getEnergyUrl(start, end, "PowerS", 60);
          }

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
            return y(d.cons * 60);
        });


    d3.json(url, function (error, data) {
        data.data.forEach(function (d) {
            d.date = parseDate(d.time);
            d.cons = +d.energy;
        });

        y.domain([d3.min(data.data, function (d) {
            return d.cons * 60;
        }) - 0.01, d3.max(data.data, function (d) {
            return d.cons * 60;
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

/* FIXME: this can be combined with Update_Continuous_Graph(), Update_Daily_Graph(), and Continuous()
    for more readability and code reuse */
function Daily() {

    // FIXME: this can all be done with css animations
    $('label[for="from"]').show(500);
    $('label[for="to"]').show(500);
    $('#from').show(500);
    $('#to').show(500);
    $('.Panel').hide();
    $('.Panel_Daily').show(500);
    //-----------------------------------------------

    var svg = d3.select("body");
    svg.selectAll("svg").remove();

    // FIXME theres probably a better alternative to glabals
    daily = true;
    continuous = false;

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
}

/* FIXME: this can be combined with Update_Continuous_Graph(), Update_Daily_Graph(), and Daily() for more readability and code
   reuse */
function Continuous() {

    // FIXME: this can all be done with css animations
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
    //-----------------------------------------------

    var svg = d3.select("body");
    svg.selectAll("svg").remove();

    // FIXME theres probably a better alternative to glabals
    continuous = true;
    daily = false;

    var url = "http://db.sead.systems:8080/466419817?start_time=1446537600&end_time=1446796800&list_format=energy&type=P&device=Panel1&granularity=60";

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

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

function getEnergyUrl(start, end, device, granularity) {
    var pathArray = window.location.pathname.split( '/' );
    var deviceId = pathArray[2];
    return "http://db.sead.systems:8080/" + deviceId + "?start_time=" + start + "&end_time=" + end + "&list_format=energy&type=P&device=" + device + "&granularity=" + granularity;
}
function getEventUrl(start, end, device) {
    var pathArray = window.location.pathname.split( '/' );
    var deviceId = pathArray[2];
    return "http://db.sead.systems:8080/" + deviceId + "?start_time=" + start + "&end_time=" + end + "&list_format=event&events=1.5&type=P&device=" + device;
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
