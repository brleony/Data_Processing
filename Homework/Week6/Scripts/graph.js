/**
* Name: Leony Brok
* Student number: 10767215
*
*
* Map of the Netherlands by Phil Pedruco
* http://bl.ocks.org/phil-pedruco/9344373

Vragen:
wat vind je van dit idee? complex genoeg?

Todo:
kleur provincie op basis van datapoint
tooltip voor kaart
bar chart met welke religies
tooltip bij barchart
interactiviteit tussen grafieken: klik op provincie -> barchart voor die provincie
**/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {

    // get data from files
    d3.queue()
        .defer(d3.json, "Data/religion.json")
        .defer(d3.json, "Data/nld.json")
        .await(createGraph);
  });
}

function createGraph (error, religion, nld) {

    // alert if error
    if (error) {
        alert(error + " Something went wrong :(");
        throw error;
    }

    drawMap(nld, religion);

    drawBarchart(religion);
};

/*
* Draw a map of the Netherlands
*
* Based on example by Phil Pedruco
* http://bl.ocks.org/phil-pedruco/9344373
*/
function drawMap(nld, religion) {

    // determine svg attributes
    //var margin = {top: 20, right: 20, bottom: 20, left: 20},
    var height = 600,
        width = 700;

    // set map height and width
    var map = d3.select(".map")
        .attr("height", height)
        .attr("width", width - 100)

    var projection = d3.geoMercator()
    .scale(1)
    .translate([0, 0]);

    var path = d3.geoPath()
        .projection(projection);

    var l = topojson.feature(nld, nld.objects.subunits).features[3],
        b = path.bounds(l),
        s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = ([(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2]);

    projection
        .scale(s)
        .translate([t[0] - 150, t[1]]);

    map.selectAll("path")
        .data(topojson.feature(nld, nld.objects.subunits).features).enter()
        .append("path")
        .attr("d", path)
        .attr("class", function(d, i) {
            return d.properties.name;
        })
        .attr("fill-opacity", function(d, i) {
            if (d.properties.name && religion[d.properties.name]) {
              return religion[d.properties.name]["2010"]["Totaal kerkelijke gezindte"] / 100.0;
            }
            return 0;
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);
};

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
