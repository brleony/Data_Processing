/*
Name: Leony Brok
Student number: 10767215
*/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {

      // get data from csv files
      d3.queue()
          .defer(d3.csv, "ginidata.csv")
          .defer(d3.tsv, "tourismdata.csv")
          .await(createScatterplot);
  });
}

// create scatterplot
function createScatterplot(error, gini, tourism) {

    if (error) {
        console.log(error);
    }

    // get data from the csv files
    var data = extractData(gini, tourism);

    // determine svg attributes
    var margin = {top: 20, right: 200, bottom: 30, left: 40},
        height = 600 - margin.top - margin.bottom,
        width = 900 - margin.left - margin.right;

    var color = d3.scale.category10();

    // set scatterplot height and width
    var scatterplot = d3.select(".scatterplot")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // scale gini coefficients
    var y = d3.scale.linear()
        .domain(d3.extent(data, function(d) { return d.giniValue; }))
        .range([0, height]);

    // scale tourism data
    var x = d3.scale.linear()
        .domain([d3.max(data, function(d) { return d.tourismValue; }), 0])
        .range([width, 0]);

    // draw axes
    drawYAxis(scatterplot, height, y);
    drawXAxis(scatterplot, height, width, x);

    // draw dots
    drawDots(scatterplot, data, color, x, y);

    // draw legend
    drawLegend(scatterplot, color, height);
}

// extract gini coefficients and tourism data
function extractData(gini, tourism) {

    data = [];

    for (var i = 0, len = gini.length; i < len; i++) {

      var datapoint = {country:gini[i]["GEO"], region:gini[i]["GEOREGION"],
          giniValue:Number(gini[i]["GiniValue"]), tourismValue:Number(tourism[i]["TourismValue"])};
      data.push(datapoint);
    }

    return data;
}

// draw y axis with axis label
function drawYAxis(scatterplot, height, y) {

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    scatterplot.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".70em")
        .style("text-anchor", "end")
        .text("Gini Coefficient");
}

// draw x axis with axis label
function drawXAxis(scatterplot, height, width, x) {

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    scatterplot.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Tourism %");
}

// plot the dots
function drawDots(scatterplot, data, color, x, y) {

    scatterplot.selectAll(".dot")
        .data(data)
    .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.tourismValue) })
        .attr("cy", function(d) { return y(d.giniValue) })
        .style("fill", function(d) { return color(d.region) });
}

// draw legend
function drawLegend(scatterplot, color, height) {

    // determine legend sizes
    var spacing = 5,
        legendRectSize = 30;

    // initiate legend
    var legend = scatterplot.selectAll("g")
        .data(color.domain())
        .enter().append("g")
             .attr("class", "legend")
             .attr("transform", function(d, i) {
               var y = i * legendRectSize;
               return "translate(0," + y + ")";
             });

    // add squares
    legend.append("rect")
        .attr("width", legendRectSize - 4)
        .attr("height", legendRectSize - 4)
        .style("fill", color)
        .style("stroke", color);

    // add labels
    legend.append("text")
        .attr("x", legendRectSize + spacing)
        .attr("y", legendRectSize - spacing)
        .text(function(d) { return d; });
}
