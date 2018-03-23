/*
* Name: Leony Brok
* Student number: 10767215
*
* Draw a map of the Netherlands
*/

function drawMap() {

    // determine svg attributes
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        height = 600,
        width = 700;

    // set map height and width
    var map = d3.select(".map")
        .attr("height", height)
        .attr("width", width - 100);

    drawProvinces(map, margin, height, width);

    drawMapLegend(map);
};

function updateYearMap() {

  var map = d3.select(".map");

  map.selectAll("path")
      .data(topojson.feature(nld, nld.objects.subunits).features)
      .attr("fill-opacity", function(d, i) {
          if (d.properties.name && religion[d.properties.name]) {
            return religion[d.properties.name][year()]["Totaal kerkelijke gezindte"] / 100.0;
          }
          return 0;
      });
};

/*
* Draw the provinces of the Nethelands.
*
* Based on example by Phil Pedruco
* http://bl.ocks.org/phil-pedruco/9344373
*/
function drawProvinces(map, margin, height, width) {

  // Create tooltip.
  var tipMap = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
       return d.properties.name + "</br>Totaal religieus: " + religion[d.properties.name][year()]["Totaal kerkelijke gezindte"] + "%";
    })
  map.call(tipMap);

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
            return religion[d.properties.name][year()]["Totaal kerkelijke gezindte"] / 100.0;
          }
          return 0;
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseover", function(d) {
          tipMap.show(d);
          d3.select(this).style("fill", "#93B7BE");
      })
      .on("mouseout", function(d) {
          tipMap.hide(d);
          d3.select(this).style("fill", "#241557")
      })
      // When clicked, update barchart with that province.
      .on("click", function(d) {
          updateBarchartProvince(d.properties.name);
      });
};

/*
* Draws a legend for the colors of the provinces.
*
* Based on example by Darren Jaworski.
* http://bl.ocks.org/darrenjaworski/5397362
*/
function drawMapLegend(map) {

  var key = map.selectAll("g.legendcolor")

  var legend = map.append("defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "100%")
    .attr("y1", "100%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

  legend.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#241557")
    .attr("stop-opacity", 0);

  legend.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#241557")
    .attr("stop-opacity", 1);

  map.append("rect")
    .attr("width", 30)
    .attr("height", 200)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(0,10)");

  var y = d3.scaleLinear()
    .range([200, 0])
    .domain([0, 100]);

  var yAxis = d3.axisRight()
    .scale(y)
    .ticks(6)
    .tickFormat(function(n) { return n + "%"});

  map.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(30,10)")
    .call(yAxis);
};
