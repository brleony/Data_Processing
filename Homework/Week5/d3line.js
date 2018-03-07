/*
Name: Leony Brok
Student number: 10767215

Data by the World Health Organization
http://www.who.int/gho/en/
*/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
        createLineGraph();
  });
}

function createLineGraph () {

    d3.json("employmentdata.json", function(error, data) {

        if (error) {
            alert(error + " Something went wrong :(");
        }

        // determine svg attributes
        var margin = {top: 20, right: 200, bottom: 30, left: 40},
            height = 600 - margin.top - margin.bottom,
            width = 900 - margin.left - margin.right;

        // set linegraph height and width
        var scatterplot = d3.select(".linegraph")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    });
}
