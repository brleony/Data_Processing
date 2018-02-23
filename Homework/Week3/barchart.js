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
    var extractedData = extractData(data);

    var weeks = extractedData[0];
    var sunshineHours = extractedData[1];

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

    // scale sunshine hours
    var y = d3.scale.linear()
        .domain([d3.max(sunshineHours, function(d) { return d; }), 0])
        .range([0, height]);

    var x = d3.scale.ordinal()
        .domain(weeks.map(function(d) { return d; }))
        .rangeRoundBands([0, width], .1);

    drawBars(chart, sunshineHours, barWidth, height, y, x);

    drawAxes(chart, y, x, height);
  });
}


function extractData(data) {
  var weeks = [];
  var sunshineHours = [];
  var sunshineWeek = 0;
  var numWeekdays = 7;

  // save sum of hours of sunshine per week
  for (var i = 0, len = data.length; i < len; i++) {

    sunshineWeek += data[i].sunshineHours;

    if (i % numWeekdays == numWeekdays - 1) {
      weeks.push(data[i].date);
      sunshineHours.push(Math.round(sunshineWeek));
      sunshineWeek = 0;
    }
  }

  if (sunshineWeek > 0) {
    weeks.push(data[i].date);
    sunshineHours.push(Math.round(sunshineWeek));
  }

  return [weeks, sunshineHours];
}


function drawBars(chart, sunshineHours, barWidth, height, y, x) {

  // enter data
  var bar = chart.selectAll("g")
    .data(sunshineHours)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });

  // add bars to chart
  bar.append("rect")
    .attr("y", function(d) { return y(d) })
    .attr("height", function(d) { return height - y(d); })
    .attr("width", barWidth - 1);

  // // add labels to bars
  // bar.append("text")
  //   .attr("y", function(d) { return y(d) - 3; })
  //   .attr("x", barWidth / 2)
  //   .attr("dy", ".75em")
  //   .text(function(d) { return d; });
}


function drawAxes(chart, y, x, height) {
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);
}
