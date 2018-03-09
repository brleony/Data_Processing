/*
Name: Leony Brok
Student number: 10767215

Used linegraphs by Mike Bostock as example:
https://bl.ocks.org/mbostock/3883245
https://bl.ocks.org/mbostock/3884955

Todo:
color lines
label lines
add crosshair
create pop-up with data
add toggle for country
*/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
        createLineGraph();
  });
}

function createLineGraph () {

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

  var parseTime = d3.timeParse("%Y");

  var x = d3.scaleTime()
      .rangeRound([0, width]);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

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

    // get all countries in data
    var countries = [];
    var firstCountryArray = data[employments[0]][0].Country;
    for (var country in firstCountryArray) {
      if (!firstCountryArray.hasOwnProperty(country)) {
        continue;
      }
      countries.push(country);
    }

    // select one country to show
    var country = countries[1]; // the Netherlands

    // set domains
    x.domain(
      d3.extent(data.Total, function(d) { return d.Year; })
        .map(function(d) { return parseTime(d); })
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
          .x(function(d) { return x(parseTime(d.Year)); })
          .y(function(d) { return y(d.Country[country]); });

      linegraph.append("path")
          .datum(employmentData)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);
    });
  });
};
