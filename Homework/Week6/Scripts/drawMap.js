/*
* Name: Leony Brok
* Student number: 10767215
*
* Draw a map of the Netherlands
*
* Based on example by Phil Pedruco
* http://bl.ocks.org/phil-pedruco/9344373
*/
function drawMap(nld, religion) {

    // determine svg attributes
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        height = 600,
        width = 700;

    // set map height and width
    var map = d3.select(".map")
        .attr("height", height)
        .attr("width", width - 100);

    drawProvinces(map, nld, religion, margin, height, width);

    drawMapLegend(map, width, margin);
};

function updateYearMap(year) {

  var map = d3.select(".map");

  var projection = d3.geoMercator()
  .scale(1)
  .translate([0, 0]);

  var path = d3.geoPath()
      .projection(projection);

  console.log(map);

  map.selectAll("path")
      .data(topojson.feature(nld, nld.objects.subunits).features).enter()
      .append("path")
      .attr("d", path)
      .attr("class", function(d, i) {
          return d.properties.name;
      })
      .attr("fill-opacity", function(d, i) {
          if (d.properties.name && religion[d.properties.name]) {
            return religion[d.properties.name][year]["Totaal kerkelijke gezindte"] / 100.0;
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
      .on("click", function(d) {
          updateBarchart(religion, d.properties.name);
      });
};

function drawProvinces(map, nld, religion, margin, height, width) {

  // create tooltip
  var tipMap = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
       return d.properties.name + "</br>Totaal religieus: " + religion[d.properties.name]["2010"]["Totaal kerkelijke gezindte"] + "%";
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
            return religion[d.properties.name]["2010"]["Totaal kerkelijke gezindte"] / 100.0;
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
      .on("click", function(d) {
          updateBarchart(religion, d.properties.name);
      });
};

function drawMapLegend(map, width, margin) {

  // determine legend offset
  var legendOffset = margin.right / 8;

  var percentage = d3.scaleLinear()
      .range([0, 20, 40, 60, 80]);

  // initiate legend
  var legend = map.selectAll("g.legendcolor")
      .data(percentage.range())
      .enter().append("g")
         .attr("class", "legendcolor")
         .attr("transform", function(d, i) {
           var y = i * legendOffset + legendOffset;
           return "translate(20," + y + ")";
         });

  // add legend title
  map.select("map").append("text")
    .attr("class", "legendcolortitle")
    .attr("x", width + margin.right - (legendOffset * 2))
    .attr("y", legendOffset)
    .attr("dy", ".35em")
    .style("font-weight", "bold")
    .text("Region");

  // add colored cicles
  legend.append("circle")
      .attr("r", legendOffset / 2)
      .attr("cx", width + margin.right - (legendOffset * 2))
      .attr("cy", 9)
      .style("fill", "#241557")
      .style("stroke", "#000000");

  // add labels to colored circles
  legend.append("text")
      .attr("x", width + margin.right - (legendOffset * 3))
      .attr("y", legendOffset / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
};
