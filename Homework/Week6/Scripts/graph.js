/**
* Name: Leony Brok
* Student number: 10767215

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

    var color = d3.scaleOrdinal()
        .range(["#a6cee3", "#1f78b4", "#b2df8a","#33a02c"]);
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
