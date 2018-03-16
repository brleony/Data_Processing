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

    console.log(religion);

    // determine svg attributes
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        height = 600 - margin.top - margin.bottom,
        width = 600 - margin.left - margin.right;

    // set graph height and width
    var graph = d3.select(".graph")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawMap(graph, nld, religion, width, height);
};

/*
* Draw a map of the Netherlands
*
* Based on example by Phil Pedruco
* http://bl.ocks.org/phil-pedruco/9344373
*/
function drawMap(graph, nld, religion, width, height) {

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
        .translate(t);

    graph.selectAll("path")
        .data(topojson.feature(nld, nld.objects.subunits).features).enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "black")
        .attr("class", function(d, i) {
            return d.properties.name;
        })
        .attr("fill-opacity", function(d, i) {
            console.log(d);
            if (d.properties.name && religion[d.properties.name]) {
              return religion[d.properties.name][0]["Totaal kerkelijke gezindte"] / 100.0;
            }
            return 0;
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);
};
