
function drawBarchart(religion) {

  // determine svg attributes
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      barWidth = 30,
      height = 600 - margin.top - margin.bottom,
      width = 600;/*(barWidth * religion["Nederland"][0].length);*/

  // set chart height and width
  var barchart = d3.select(".barchart")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var y = d3.scaleLinear()
      .domain([100, 0])
      .range([0, height]);

  var x = d3.scalePoint()
      .domain([d3.keys(religion["Nederland"]["2010"])])
      .range([0, width]);

  // create tooltip
  /*var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
       return "<strong>%</strong> <span style='color:#FBA90A'>" + d + "</span>";
    })

  chart.call(tip);*/

  // draw bars
  drawBars(barchart, religion, barWidth, height, y);

  // draw axes
  drawYAxis(barchart, height, y);
  drawXAxis(barchart, height, x);
};


// draw bars for hours of sunshine
function drawBars(barchart, religion, barWidth, height, y) {

    // enter data
    var bar = barchart.selectAll("rect")
        .data(d3.values(religion["Nederland"]["2010"]))
        .enter();

    // add bars to chart
    bar.append("rect")
        .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; })
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); })
        .attr("width", barWidth - 1);
        /*.on("mouseover", function(d) {
            tip.show(d);
            d3.select(this).style("fill", "#FBA90A");
        })
        .on("mouseout", function(d) {
            tip.hide(d);
            d3.select(this).style("fill", "#236AB9");
        });*/
}

// draw y axis with axis label
function drawYAxis(barchart, height, y) {

    barchart.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("text-anchor", "end")
        .text("% inwoners");
}

// draw x axis with axis label
function drawXAxis(barchart, height, x) {

    barchart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
      .append("text")
        .attr("x", 780)
        .attr("dy", "2.50em")
        .style("text-anchor", "end")
        .text("Week");
}
