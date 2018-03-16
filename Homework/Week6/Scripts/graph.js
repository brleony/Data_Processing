/**
* Name: Leony Brok
* Student number: 10767215
*
*
* Map of the Netherlands by Phil Pedruco
* http://bl.ocks.org/phil-pedruco/9344373

Todo:
tooltip voor kaart
fix x-as barchart
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
