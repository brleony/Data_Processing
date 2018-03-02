/*
Name: Leony Brok
Student number: 10767215

Color scheme from colorbrewer2
http://colorbrewer2.org

Used scatterplot by Mike Bostock as example:
https://bl.ocks.org/mbostock/3887118
*/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {

      // get data from csv files
      d3.queue()
          .defer(d3.csv, "ginidata.csv")
          .defer(d3.csv, "tourismdata.csv")
          .defer(d3.csv, "gdpdata.csv")
          .await(createScatterplot);
  });
}

// create scatterplot
function createScatterplot(error, gini, tourism, gdp) {

    if (error) {
        console.log(error);
    }

    // get data from the csv files
    var data = extractData(gini, tourism, gdp);

    // determine svg attributes
    var margin = {top: 20, right: 200, bottom: 30, left: 40},
        height = 600 - margin.top - margin.bottom,
        width = 900 - margin.left - margin.right;

    var color = d3.scale.ordinal()
        .range(["#a6cee3", "#1f78b4", "#b2df8a","#33a02c"]);

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

    // draw legends for color and size of dots
    drawLegendColor(scatterplot, color, margin, width);
    drawLegendSize(scatterplot, margin, width);
}

// extract gini coefficients and tourism data
function extractData(gini, tourism, gdp) {

    data = [];

    for (var i = 0, len = gini.length; i < len; i++) {

      var datapoint = {country:gini[i]["GEO"], region:gini[i]["GEOREGION"],
          giniValue:Number(gini[i]["GiniValue"]), tourismValue:Number(tourism[i]["TourismValue"]),
          gdpValue:gdp[i]["Value"]};
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

    // tooltip with country, region, gini index, tourism percentage and gdp/capita
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
         return d.country + " (" + d.region + ")</br>Gini coefficient: " + d.giniValue +
         "<br/>Tourism: " + d.tourismValue + "%</br>GDP per capita: " + d.gdpValue;
      })

    scatterplot.call(tip);

    // draw dots
    scatterplot.selectAll(".dot")
        .data(data)
    .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return d.gdpValue / 4000 })
        .attr("cx", function(d) { return x(d.tourismValue) })
        .attr("cy", function(d) { return y(d.giniValue) })
        .style("fill", function(d) { return color(d.region) })
        .on("mouseover", function(d) {
            tip.show(d);
        })
        .on("mouseout", function(d) {
            tip.hide(d);
        });
}

// draw legend for colors of the dots
function drawLegendColor(scatterplot, color, margin, width) {

    // determine legend offset
    var legendOffset = margin.right / 8;

    // initiate legend
    var legend = scatterplot.selectAll("g.legendcolor")
        .data(color.domain())
        .enter().append("g")
           .attr("class", "legendcolor")
           .attr("transform", function(d, i) {
             var y = i * legendOffset + legendOffset;
             return "translate(20," + y + ")";
           });

    // add legend title
    d3.select("svg").append("text")
      .attr("class", "legendcolortitle")
      .attr("x", width + margin.right - (legendOffset * 2))
      .attr("y", legendOffset)
      .attr("dy", ".35em")
      .style("font-weight", "bold")
      .text("Region");

    // add colored cicles
    legend.append("circle")
        .attr("r", legendOffset / 2)
        .attr("cx", width + margin.right - (legendOffset * 2))
        .attr("cy", 9)
        .style("fill", color)
        .style("stroke", "#000000")

    // add labels to colored circles
    legend.append("text")
        .attr("x", width + margin.right - (legendOffset * 3))
        .attr("y", legendOffset / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}

// draw legend for the size of the dots
function drawLegendSize(scatterplot, margin, width) {

    // determine legend offset
    var legendOffset = margin.right / 8;

    // determine size of circles in legend
    var size = d3.scale.ordinal()
        .range([20000, 35000, 50000]);

    // initiate legend
    var legend = scatterplot.selectAll("g.legendsize")
        .data(size.range())
        .enter().append("g")
           .attr("class", "legendsize")
           .attr("transform", function(d, i) {
             var y = i * legendOffset + legendOffset * 8;
             return "translate(20," + y + ")";
           });

     // add legend title
     d3.select("svg").append("text")
       .attr("class", "legendcolortitle")
       .attr("x", width + margin.right - (legendOffset * 4))
       .attr("y", legendOffset * 8)
       .attr("dy", ".35em")
       .style("font-weight", "bold")
       .text("GDP per capita");

    // add different sized circles
    legend.append("circle")
        .attr("r", function(d) { return d / 4000 })
        .attr("cx", width + margin.right - (legendOffset * 2))
        .attr("cy", 9)
        .style("fill", "white")
        .style("stroke", "#000000");

    // add labels to different sized circles
    legend.append("text")
        .attr("x", width + margin.right - (legendOffset * 3))
        .attr("y", legendOffset / 3)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}
