/*
Name: Leony Brok
Student number: 10767215

Color scheme from colorbrewer2
http://colorbrewer2.org

Used tutorial by Tiety Kooistra
http://www.competa.com/blog/d3-js-part-7-of-9-adding-a-legend-to-explain-the-data/
*/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
        main();
  });
}

// set svg attributes and draw legend
function main() {

  // determine svg attributes
  var height = 150,
      width = 150;

  // set chart height and width
  var chart = d3.select(".chart")
      .attr("height", height)
      .attr("width", width)

  // draw legend
  drawLegend(chart, height);
}

// draw legend
function drawLegend(chart, height) {

    // determine legend sizes
    var spacing = 5,
        legendRectSize = 25;

    // set colors for legend squares
    var color = d3.scale.ordinal()
        .domain(["1", "2", "3", "4", "5"])
        .range(["#bcbddc", "#9e9ac8", "#807dba","#6a51a3","#4a1486"]);

    // initiate legend
    var legend = chart.selectAll("g")
        .data(color.domain())
        .enter()
        .append("g")
             .attr("class", "legend")
             .attr("transform", function(d, i) {
               var y = i * legendRectSize;
               return "translate(0," + y + ")";
             });

    // add squares
    legend.append("rect")
        .attr("width", legendRectSize - 4)
        .attr("height", legendRectSize - 4)
        .style("fill", color)
        .style("stroke", color);

    // add labels
    legend.append("text")
        .attr("x", legendRectSize + spacing)
        .attr("y", legendRectSize - spacing)
        .text(function(d) { return d; });
}
