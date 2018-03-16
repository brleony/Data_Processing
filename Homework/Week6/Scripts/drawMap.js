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
