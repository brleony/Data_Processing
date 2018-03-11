/*
Name: Leony Brok
Student number: 10767215

Used linegraphs by Mike Bostock as example:
https://bl.ocks.org/mbostock/3883245
https://bl.ocks.org/mbostock/3884955

Used answer by Gerardo Furtado:
https://stackoverflow.com/questions/38687588/add-horizontal-crosshair-to-d3-js-chart

Todo:
kleuren veranderen
*/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
        var select = d3.select('#ids');
    		select.on("change", function() {
          d3.select(".linegraph").selectAll("*").remove();
          createLineGraph(this.value);
        });
        createLineGraph(select.node().value);
  });
}

function createLineGraph(country) {

  // determine svg attributes
  var margin = {top: 20, right: 150, bottom: 30, left: 40},
      width = 900 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  // set chart height and width
  var linegraph = d3.select(".linegraph")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // scale x and y
  var x = d3.scaleTime()
      .rangeRound([0, width]),
      y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var color = d3.scaleOrdinal()
      .range(["#1f78b4", "#33a02c", "#b2df8a"]);

  // get data from json
  d3.json("employmentdata.json", function(error, data) {

    if (error) {
        alert(error + " Something went wrong :(");
        throw error;
    }

    // get all employment types in data
    var employments = [];
    for (var employment in data) {
      if (!data.hasOwnProperty(employment)) {
        continue;
      }
      employments.push(employment);
    }

    // change years to javascript dates
    for (var i = 0, parseTime = d3.timeParse("%Y"); i < employments.length; i++) {
      data[employments[i]] = data[employments[i]].map(function(d) {
         d.Year = parseTime(d.Year);
         return d;
      });
    }

    // get all countries in data
    var countries = [];
    var firstCountryArray = data[employments[0]][0].Country;
    for (var c in firstCountryArray) {
      if (!firstCountryArray.hasOwnProperty(c)) {
        continue;
      }
      countries.push(c);
    }

    // set domains
    x.domain(d3.extent(data.Total, function(d) { return d.Year; }));
    y.domain([0, d3.max(data.Total, function(d) { return d.Country[country]})]);

    // draw the x axis and y axis
    drawAxes(linegraph, height, x, y);

    // draw lines
    drawLines(linegraph, employments, data, country, color, x, y);

    // create crosshair with labels
    createCrosshair(linegraph, employments, data, country, width, height, x, y);

    // draw legend for line color
    drawLegend(linegraph, color, margin, width);
  });
};

/* draw the x axis and y axis */
function drawAxes(linegraph, height, x, y) {

  // plot x-axis
  linegraph.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // plot y-axis
  linegraph.append("g")
    .call(d3.axisLeft(y))
  .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .style("font", "14px sans-serif")
    .text("People age 15-64 employed (x1000)");
};

/* draw a line for every 'type' of employment */
function drawLines (linegraph, employments, data, country, color, x, y) {

  employments.forEach(function(employment) {
    var employmentData = data[employment];

    var line = d3.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Country[country]); });

    linegraph.append("path")
      .datum(employmentData)
      .attr("fill", "none")
      .attr("stroke", color(employment))
      .attr("stroke-width", 2)
      .attr("d", line);
  });
};

/* create a crosshair with labels */
function createCrosshair (linegraph, employments, data, country, width, height, x, y) {

  var bisect = d3.bisector(function(d) { return d.Year; }).left;

  // create crosshair
  var verticalLine = linegraph.append("line")
    .attr("opacity", 0)
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .attr("pointer-events", "none");

  // create labels for every line
  var texts = {};
  employments.forEach(function(employment) {
    var text = linegraph.append("text")
      .attr("fill", "#000")
      .attr("opacity", 0);
    texts[employment] = text;
  });

  // overlay graph with transparent rectangle to get mouse movements
  var transpRect = linegraph.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white")
    .attr("opacity", 0);

  // do something when mouse is on the transparent rect
  transpRect.on("mousemove", function() {

    mouse = d3.mouse(this);
    mouseX = mouse[0];
    var mouseDate = x.invert(mouseX);
    verticalLine.attr("x1", mouseX)
      .attr("x2", mouseX)
      .attr("opacity", 1);

    employments.forEach(function(employment) {
      var text = texts[employment];

      var i = bisect(data[employment], mouseDate);

      var datum0 = data[employment][i - 1];
      var datum1 = data[employment][i];
      var datum = mouseDate - datum0.Year > datum1.Year - mouseDate ? datum1 : datum0;

      text.attr("x", mouseX)
        .attr("y", y(datum.Country[country]))
        .attr("dy", 20)
        .attr("dx", 4)
        .attr("opacity", 1)
        .text(String(datum.Country[country]) + "k");
    });
  // remove text and crosshair when mouse leaves transparent rect
  }).on("mouseout", function() {
    verticalLine.attr("opacity", 0);
    employments.forEach(function(employment) {
      texts[employment].attr("opacity", 0)
    });
  });
};

/* draw legend for colors of the dots */
function drawLegend(linegraph, color, margin, width) {

    // determine legend offset
    var legendOffset = margin.right / 8;

    // initiate legend
    var legend = linegraph.selectAll("g.legendcolor")
        .data(color.domain())
        .enter().append("g")
           .attr("class", "legendcolor")
           .attr("transform", function(d, i) {
             var y = i * legendOffset + legendOffset;
             return "translate(20," + y + ")";
           });

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
};
