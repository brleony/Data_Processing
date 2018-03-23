/*
* Name: Leony Brok
* Student number: 10767215
*
* Draws a bar chart.
*/

function drawBarchart() {

  // Determine svg attributes.
  margin = {top: 20, right: 30, bottom: 180, left: 80},
      barWidth = 30,
      height = 500 - margin.top - margin.bottom,
      width = barWidth * (d3.keys(religion[province()][year()]).length);

  // Set chart height and width.
  var barchart = d3.select(".barchart")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  y = d3.scaleLinear()
      .domain([100, 0])
      .range([0, height]);

  x = d3.scaleBand()
      .domain(d3.keys(religion[province()][year()]))
      .range([0, width]);

  // Create tooltip.
  var tipBarchart = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
       return d + "%";
    })
  barchart.call(tipBarchart);

  // Draw bars.
  drawBars(barchart, barWidth, height, tipBarchart);

  // Draw axes.
  drawYAxis(barchart, height);
  drawXAxis(barchart, height, x);
};

function updateBarchart() {

  var barchart = d3.select(".barchart");

  var bar = barchart.selectAll("rect")
      .data(d3.values(religion[province()][year()]))
      .transition()
        .duration(700)
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); });

  document.getElementById("provincename").textContent=province();
};

/*
* Sort bars in barchart in descending order.
*
* Based on example by James Curley
* https://bl.ocks.org/jalapic/acb4b8b6523e73394c86/454da2974578bcc9b4bb4090cf005cd2fa1a3ef6
*/
function sortBars() {

  // Select bars in bar chart.
  var barchart = d3.select(".barchart");
  var bars = barchart.selectAll("rect");

  // Sort bars in descending order.
  bars.sort(function(a, b) { return d3.descending(a, b); })
			.transition()
  			.delay(function(d, i) { return i * 50; })
  			.duration(700)
  			.attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });

  var xAxis = d3.select(".x.axis");
  xAxis.transition()
    .duration(700);
}

/*
* Draw bars.
*/
function drawBars(barchart, barWidth, height, tipBarchart) {

    // Enter data.
    var bar = barchart.selectAll("rect")
        .data(d3.values(religion[province()][year()]))
        .enter();

    // Add bars to chart.
    bar.append("rect")
        .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; })
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); })
        .attr("width", barWidth - 1)
        .on("mouseover", function(d) {
            tipBarchart.show(d);
            d3.select(this).style("fill", "#93B7BE");
        })
        .on("mouseout", function(d) {
            tipBarchart.hide(d);
            d3.select(this).style("fill", "#241557");
        });
}

/*
* Draw y axis with axis title.
*/
function drawYAxis(barchart, height) {

    barchart.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", - (height / 2))
        .attr("dy", "0.71em")
        .style("font-weight", "bold")
        .text("% inwoners");
}

/*
* Draw x axis with labels.
*/
function drawXAxis(barchart, height, x) {

  var xAxis = d3.axisBottom(x)
    .tickSize(0);

  barchart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
          return "rotate(-65)"
        });
}
