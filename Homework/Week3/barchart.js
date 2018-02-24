/*
Name: Leony Brok
Student number: 10767215

Used tutorial by Mike Bostock:
https://bost.ocks.org/mike/bar/
*/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function() {
        createChart();
  });
}

// create the chart
function createChart() {

    d3.json("sundata.json", function(data) {

        // get weeks and hours of sunshine from the json file
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

        // create tooltip
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
             return "<strong>Hours:</strong> <span style='color:#FBA90A'>" + d + "</span>";
          })

        chart.call(tip);

        // draw bars
        drawBars(chart, sunshineHours, barWidth, height, y, tip);

        // draw axes
        drawYAxis(chart, height, y);
        drawXAxis(chart, height, x);
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

        // every 7 days, push weekly sunshine hours to array
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
function drawBars(chart, sunshineHours, barWidth, height, y, tip) {

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
        .on("mouseover", function(d) {
            tip.show(d);
            d3.select(this).style("fill", "#FBA90A");
        })
        .on("mouseout", function(d) {
            tip.hide(d);
            d3.select(this).style("fill", "#236AB9");
        });
}

// draw y axis with axis label
function drawYAxis(chart, height, y) {

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".70em")
        .style("text-anchor", "end")
        .text("Hours of Sunshine");
}

// draw x axis with axis label
function drawXAxis(chart, height, x) {

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

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
