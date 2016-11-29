var barchart = function(room, mod_i, data_i) {
  //console.log('barchart added');

//Define Margin
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//Define SVG
var svg = d3.select("#" + room.modules[mod_i].el_id)
    .append("svg")
    .attr("id", room.modules[mod_i].el_id + "svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//define Scales
var formatPercent = d3.format(".0");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

//Define x-axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//Define y-axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'tooltip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:black'>" + "$" + d.amount + "</span>";
  })
svg.call(tip);

svg.selectAll(".bar")
      .data(room.data[data_i])
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.days); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.amount); })
      .attr("height", function(d) { return height - y(d.amount); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

svg.selectAll(".text")
        .data(scatterdataset)
        .enter().append("text")
        .attr("class", "text")
        .style("text-anchor", "start")
        
        
        .style("font-weight", "bold")

    .text(function(d) {
        return "$" + d.amount;
    });
}

