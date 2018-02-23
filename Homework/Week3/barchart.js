/*
Name: Leony Brok
Student number: 10767215
*/

if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function() {
        createChart();
    });
}

function createChart() {

  d3.json("sundata.json", function(data) {

    // save hours of sunshine per week
    var sunshineHours = getSunshineHours(data);

    // determine svg attributes
    var barWidth = 15,
        margin = {top: 20, right: 30, bottom: 30, left: 40}
        height = 500 - margin.top - margin.bottom,
        width = (barWidth * sunshineHours.length);

    // set chart height and width
    var chart = d3.select(".chart")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawBars(chart, sunshineHours, barWidth, height);
  });
}

function getSunshineHours(data) {
  var sunshineHours = [];
  var sunshineWeek = 0;
  var numWeekdays = 7;

  // save sum of hours of sunshine per week
  for (var i = 0, len = data.length; i < len; i++) {
    sunshineWeek += data[i].sunshineHours;
    if (i % numWeekdays == numWeekdays - 1) {
      sunshineHours.push(Math.round(sunshineWeek));
      sunshineWeek = 0;
    }
  }

  if (sunshineWeek > 0) {
    sunshineHours.push(Math.round(sunshineWeek));
  }

  return sunshineHours;
}

function drawBars(chart, sunshineHours, barWidth, height) {

  // scale sunshine hours
  var y = d3.scale.linear()
      .domain([d3.max(sunshineHours, function(d) { return d; }), 0])
      .range([0, height]);

  // enter data
  var bar = chart.selectAll("g")
    .data(sunshineHours)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });

  // add bars to chart
  bar.append("rect")
    .attr("y", function(d) { return y(d) - 10; })
    .attr("height", function(d) { return height - y(d); })
    .attr("width", barWidth - 1);

  // add labels to bars
  bar.append("text")
    .attr("y", function(d) { return y(d) - 3; })
    .attr("x", barWidth / 2)
    .attr("dy", ".75em")
    .text(function(d) { return d; });
}
