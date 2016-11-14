var scatter = function(room, mod_i, data_i) {
    console.log('scatterplot added');

    //Define Margin
    var margin = { left: 80, right: 80, top: 50, bottom: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scale.category20();

    //Define SVG
    var svg = d3.select("#" + room.modules[mod_i].el_id)
        .append("svg")
        .attr("id", room.modules[mod_i].el_id + "svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //Define Scales   


    var xScale = d3.scale.linear()
        .domain([0, 24]) //Need to redefine this after loading the data
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([-10, 400]) //Need to redfine this after loading the data
        .range([height, 0]);

    //Define Tooltip here


    //Define Axis
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2);
    // var yAxis = d3.svg.axis().scale(yScale).orient("left").tickPadding(2);

    //Get Data
    // Define domain for xScale and yScale

    var tip = d3.tip()
        .attr('class', 'tooltip')
        .offset([-10, 0])
        .html(function(d) {
            return " <span>" + "Usage: $" + d.amount +
                "<br/>Was on for: " + d.was_on / 4 + " minutes" +
                "<br/>Off-Peak Cost would be: $" + d.amount / 2 + " just saying"
            "</span>";
        });
    svg.call(tip);

    //Draw Scatterplot
    svg.selectAll(".dot")
        .data(room.data[data_i])
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {
            return Math.sqrt(d.total) / .1;
        })
        .attr("cx", function(d) {
            return xScale(d.hour);
        })
        .attr("cy", function(d) {
            return yScale(d.epc);
        })
        .style("fill", function(d) {
            return "rgba(255 ,153,50,0.8)";
        })
        .style("stroke", function(d) {
            return "rgba(255,255,255, 0.3)";
        })
        .style("stroke-width", function(d) {
            return "5px";
        })


    .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    //Add .on("mouseover", .....
    //Add Tooltip.html with transition and style
    //Then Add .on("mouseout", ....

    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom

    //Draw dollar amount
    svg.selectAll(".text")
        .data(scatterdataset)
        .enter().append("text")
        .attr("class", "text")
        .style("text-anchor", "start")
        .attr("x", function(d) {
            return xScale(d.hour) - 15;
        })
        .attr("y", function(d) {
            return yScale(d.epc) + 2;
        })
        .style("fill", function(d) {
            return "rgb(255,255,255)";
        })
        .style("font-weight", "bold")

    .text(function(d) {
        return "$" + d.amount;
    });

    //x-axis
    svg.append("g")
        .attr("class", "x axis", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width / 2)
        .style("text-anchor", "end")
        .attr("font-size", "200px")
        .text("Time");

};


// $(function () {
//     var seriesOptions = [],
//         seriesCounter = 0,
//         names = ['MSFT', 'AAPL', 'GOOG'];

//     /**
//      * Create the chart when all data is loaded
//      * @returns {undefined}
//      */
//     function createChart() {

//         Highcharts.stockChart('Home1', {

//             rangeSelector: {
//                 selected: 4
//             },

//             yAxis: {
//                 labels: {
//                     formatter: function () {
//                         return (this.value > 0 ? ' + ' : '') + this.value + '%';
//                     }
//                 },
//                 plotLines: [{
//                     value: 0,
//                     width: 2,
//                     color: 'silver'
//                 }]
//             },

//             plotOptions: {
//                 series: {
//                     compare: 'percent',
//                     showInNavigator: true
//                 }
//             },

//             tooltip: {
//                 pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
//                 valueDecimals: 2,
//                 split: true
//             },

//             series: seriesOptions
//         });
//     }

//     $.each(names, function (i, name) {

//         $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',    function (data) {

//             seriesOptions[i] = {
//                 name: name,
//                 data: data
//             };

//             // As we're loading the data asynchronously, we don't know what order it will arrive. So
//             // we keep a counter and create the chart when all the data is loaded.
//             seriesCounter += 1;

//             if (seriesCounter === names.length) {
//                 createChart();
//             }
//         });
//     });
// });
