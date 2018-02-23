/*
Name: Leony Brok
Student number: 10767215
*/

// wait until DOM has loaded
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
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        barWidth = 15,
        height = 600 - margin.top - margin.bottom,
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

    // scale weeks
    var x = d3.scale.linear()
        .domain([d3.max(weeks, function(d) { return d; }), 0])
        .range([width, 0]);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Hours:</strong> <span style='color:red'>" + d + "</span>";
      })

    chart.call(tip);

    // draw bars
    drawBars(chart, sunshineHours, barWidth, height, y, x, tip);

    // draw axes
    drawAxes(chart, y, x, height);


  });
}

// extract hours of sunshine per week + week numbers
function extractData(data) {
  var sunshineHours = [];
  var sunshineWeek = 0;
  var numWeekdays = 7;

  // save sum of hours of sunshine per week
  for (var i = 0, len = data.length; i < len; i++) {

    sunshineWeek += data[i].sunshineHours;

    // every 7 days, add weekly sunshine to array
    if (i % numWeekdays == numWeekdays - 1) {
      sunshineHours.push(Math.round(sunshineWeek));
      sunshineWeek = 0;
    }
  }

  // add remaining hours of sunshine
  if (sunshineWeek > 0) {
    sunshineHours.push(Math.round(sunshineWeek));
  }

  // create array of week numbers
  var weeks = [];
  for (var i = 0, len = sunshineHours.length; i < len; i++) {
    weeks.push(i + 1);
  }

  return [weeks, sunshineHours];
}

// draw bars for hours of sunshine
function drawBars(chart, sunshineHours, barWidth, height, y, x, tip) {

  // enter data
  var bar = chart.selectAll("g")
    .data(sunshineHours)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });

  // add bars to chart
  bar.append("rect")
    .attr("y", function(d) { return y(d) })
    .attr("height", function(d) { return height - y(d); })
    .attr("width", barWidth - 1)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
}

// draw x axis and y axis with axis labels
function drawAxes(chart, y, x, height) {

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  // draw y axis with label
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".70em")
      .style("text-anchor", "end")
      .text("Hours of Sunshine");

  // draw x axis with label
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", 780)
      .attr("dy", "2.50em")
      .style("text-anchor", "end")
      .text("Week");
}
