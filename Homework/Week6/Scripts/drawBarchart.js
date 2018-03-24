/*
* Name: Leony Brok
* Student number: 10767215
*
* Draws a bar chart.
*/

/*
* Draws a barchart.
*/
function drawBarchart() {

  // Determine svg attributes.
  margin = {top: 20, right: 30, bottom: 200, left: 80},
      barWidth = 30,
      height = 500 - margin.top - margin.bottom,
      width = barWidth * (d3.keys(religion[province()][year()]).length);

  // Set chart height and width.
  var barchart = d3.select(".barchart")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale y and x.
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

/*
* Update barchart with new province.
*/
function updateBarchart() {

  var barchart = d3.select(".barchart");

  // Update bars with new data.
  var data = religion[province()][year()];
  var bar = barchart.selectAll("rect")
      .data(d3.entries(data));

  // Update x domain with new data.
  x.domain(d3.keys(religion[province()][year()]));

  // Create transition.
  var transition = barchart.transition().duration(800);
  var delay = function(d, i) { return i * 50; };

  // Transition bars.
  transition.selectAll("rect")
    .delay(delay)
    .attr("x", function (d) {return x(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); });

  // Transition x axis.
  transition.select(".x.axis")
    .call(xAxis)
   .selectAll("g")
    .delay(delay);

  // Update barchart title.
  document.getElementById("provincename").textContent=province();
};

/*
* Sort bars in barchart in descending order.
*
* Based on example by Mike Bostock
* https://bl.ocks.org/mbostock/3885705
*/
function sortBars() {

  // Select bars in bar chart.
  var barchart = d3.select(".barchart");
  var bars = barchart.selectAll("rect");

  var data = d3.entries(religion[province()][year()]);

  // Sort data in descending order.
  var sortedData = data.sort(
      function(a, b) { return d3.descending(a.value, b.value); });

  x.domain(sortedData.map(function(d) { return d.key; }));

  // Create transition.
  var transition = barchart.transition().duration(800);
  var delay = function(d, i) { return i * 50; };

  // Sort bars.
  transition.selectAll("rect")
    .delay(delay)
    .attr("x", function(d) {return x(d.key); });

  // Sort x axis.
  transition.select(".x.axis")
    .call(xAxis)
   .selectAll("g")
    .delay(delay);
}

/*
* Draw bars.
*/
function drawBars(barchart, barWidth, height, tipBarchart) {

    // Enter data.
    var bar = barchart.selectAll("rect")
        .data(d3.entries(religion[province()][year()]))
        .enter();

    // Add bars to chart.
    bar.append("rect")
        .attr("x", function(d) {return x(d.key)})
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", barWidth - 1)
        .on("mouseover", function(d) {
            tipBarchart.show(d.value);
            d3.select(this).style("fill", "#93B7BE");
        })
        .on("mouseout", function(d) {
            tipBarchart.hide(d.value);
            d3.select(this).style("fill", "#241557");
        });
}

/*
* Draw y axis with axis title.
*/
function drawYAxis(barchart, height) {

    barchart.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).tickFormat(function(n) { return n + "%"}))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", - (height / 2))
        .attr("dy", "0.71em")
        .style("font-weight", "bold")
        .text("Inwoners");
}

/*
* Draw x axis with labels.
*/
function drawXAxis(barchart, height, x) {

  xAxis = d3.axisBottom(x)
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
