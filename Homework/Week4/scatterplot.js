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

    if(error) {
        console.log(error);
    }

    // extract gini coefficients and tourism data
    var extractedData = extractData(gini, tourism);
    var giniData = extractedData[0];
    var tourismData = extractedData[1];

    // determine svg attributes
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        height = 600 - margin.top - margin.bottom,
        width = 900 - margin.left - margin.right;

    // set scatterplot height and width
    var scatterplot = d3.select(".scatterplot")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // scale gini coefficients
    var y = d3.scale.linear()
        .domain([d3.max(giniData, function(d) { return d; }), 0])
        .range([0, height]);

    // scale tourism data
    var x = d3.scale.linear()
        .domain([d3.max(tourismData, function(d) { return d; }), 0])
        .range([width, 0]);

    // draw axes
    drawYAxis(scatterplot, height, y);
    drawXAxis(scatterplot, height, width, x);
}

// extract gini coefficients and tourism data
function extractData(gini, tourism) {

  var giniData = [];
  gini.forEach(function(line) {
      giniData.push(Number(line["GiniValue"]));
  });

  var tourismData = [];
  tourism.forEach(function(line) {
      tourismData.push(Number(line["TourismValue"]));
  });

  return [giniData, tourismData];
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
        .text("Tourism");
}
