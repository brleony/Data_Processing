/*
Name: Leony Brok
Student number: 10767215
*/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
        createScatterplot();
  });
}

// create scatterplot
function createScatterplot() {

    // get data from csv files
    d3.queue()
        .defer(d3.csv, "ginidata.csv")
        .defer(d3.tsv, "tourismdata.csv")
        .await(analyze);

    // determine svg attributes
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        height = 600 - margin.top - margin.bottom,
        width = 800 - margin.left - margin.right;

    // set chart height and width
    var scatterplot = d3.select(".scatterplot")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function analyze(error, gini, tourism) {
    if(error) { console.log(error); }

    console.log(gini);
    console.log(tourism);
}
