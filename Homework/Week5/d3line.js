/*
Name: Leony Brok
Student number: 10767215

Used linegraphs by Mike Bostock as example:
https://bl.ocks.org/mbostock/3883245
https://bl.ocks.org/mbostock/3884955

Todo:
color lines
add crosshair
create pop-up with data
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
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = 900 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  // set chart height and width
  var linegraph = d3.select(".linegraph")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleTime()
      .rangeRound([0, width]),
      y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var color = d3.scaleOrdinal()
      .range(["#1b9e77", "#d95f02", "#7570b3"]);

  d3.json("employmentdata.json", function(error, data) {
    if (error) {
        alert(error + " Something went wrong :(");
        throw error;
    }

    // get all possible employments
    var employments = [];
    for (var employment in data) {
      if (!data.hasOwnProperty(employment)) {
        continue;
      }
      employments.push(employment);
    }

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
    x.domain(
      d3.extent(data.Total, function(d) { return d.Year; })
    );
    y.domain([0, d3.max(data.Total, function(d) { return d.Country[country]})]);

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
        .text("People age 15-64 working (x1000)");

    // for every kind of employment plot graph
    employments.forEach(function(employment) {
      var employmentData = data[employment];

      var line = d3.line()
          .x(function(d) { return x(d.Year); })
          .y(function(d) { return y(d.Country[country]); });

      linegraph.append("path")
          .datum(employmentData)
          .attr("fill", "none")
          .attr("stroke", function(d) { return color(d.employment) })
          .attr("stroke-width", 1.5)
          .attr("d", line);
    });

    // CROSSHAIR STUFF TODO
    var bisect = d3.bisector(function(d) { return d.Year; }).left;

    var transpRect = linegraph.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "white")
      .attr("opacity", 0);

    var verticalLine = linegraph.append("line")
      .attr("opacity", 0)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("pointer-events", "none");

    var text = linegraph.append("text")
      .attr("fill", "#000")
      //.attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      //.attr("text-anchor", "end")
      .text("People age 15-64 working (x1000)");

    transpRect.on("mousemove", function() {
      mouse = d3.mouse(this);
      mouseX = mouse[0];
      var mouseDate = x.invert(mouseX);
      var i = bisect(data["Total"], mouseDate);

      var datum0 = data["Total"][i - 1];
      var datum1 = data["Total"][i];
      var datum = mouseDate - datum0.Year > datum1.Year - mouseDate ? datum1 : datum0;
      
      console.log(datum);

      verticalLine.attr("x1", mouseX).attr("x2", mouseX).attr("opacity", 1);
    }).on("mouseout", function(){
      verticalLine.attr("opacity", 0);
    });
  });
};

function createCrossHair(linegraph, width, height) {

}
