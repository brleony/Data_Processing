/**
* Name: Leony Brok
* Student number: 10767215
*
*
Todo:
bars op grootte sorteren
legenda voor kaart
storytelling op de website
titels bij kaart en barchart
wat doe ik met y??
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
