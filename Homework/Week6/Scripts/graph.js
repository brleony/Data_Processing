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
kaart van NL toevoegen
kleur provincie op basis van datapoint
tooltip voor kaart
bar chart met welke religies
tooltip bij barchart
interactiviteit tussen grafieken: klik op provincie -> barchart voor die provincie
**/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {

    // get data from csv file
    d3.queue()
        .defer(d3.csv, "Data/religion.csv")
        .await(createGraph);
  });
}

function createGraph (error, religion) {

    // alert if error
    if (error) {
        alert(error + " Something went wrong :(");
        throw error;
    }

    // get data from the csv file
    var data = extractData(religion);

    console.log(data);

    // determine svg attributes
    var margin = {top: 20, right: 200, bottom: 30, left: 40},
        height = 600 - margin.top - margin.bottom,
        width = 900 - margin.left - margin.right;

    // set graph height and width
    var graph = d3.select(".graph")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawMap(graph, width, height);
};

// extract data
function extractData(religion) {

    data = [];

    for (var i = 0, len = religion.length; i < len; i++) {

        // create datapoint with region, year and percentage of every category
        var datapoint = {region:religion[i]["Regio"],
            year:Number(religion[i]["Jaar"]),
            aReligieus:Number(religion[i]["Geen kerkelijke gezindte"]),
            religieus:Number(religion[i]["Totaal kerkelijke gezindte"]),
            katholiek:Number(religion[i]["Rooms-Katholiek"]),
            protestants:Number(religion[i]["Protestantse Kerk in Nederland"]),
            hervormd:Number(religion[i]["Nederlands Hervormd"]),
            gereformeerd:Number(religion[i]["Gereformeerd"]),
            islam:Number(religion[i]["Islam"]),
            overigReligieus:Number(religion[i]["Overige gezindte"])};

        data.push(datapoint);
    }

    return data;
}

// draw map
function drawMap(graph, width, height) {

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var projection = d3.geoMercator()
    .scale(1)
    .translate([0, 0]);

    var path = d3.geoPath()
        .projection(projection);

    d3.json("Data/nld.json", function(error, nld) {

        var l = topojson.feature(nld, nld.objects.subunits).features[3],
            b = path.bounds(l),
            s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

        projection
            .scale(s)
            .translate(t);

        graph.selectAll("path")
            .data(topojson.feature(nld, nld.objects.subunits).features).enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("class", function(d, i) {
                return d.properties.name;
            });
    });
};
