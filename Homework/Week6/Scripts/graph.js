/**
* Name: Leony Brok
* Student number: 10767215
**/

// Initial year and 'province'.
currentYear = 2010;
currentProvince = "Nederland";

// Wait until DOM has loaded.
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {

    // Get data from files and create visualizations.
    d3.queue()
        .defer(d3.json, "Data/religion.json")
        .defer(d3.json, "Data/nld.json")
        .await(function (error, data, topo) {
          religion = data;
          nld = topo;
          createGraph(error);
        });
  });
}

/*
* Create the map and the barchart.
*/
function createGraph(error) {

    // Alert if error.
    if (error) {
        alert(error + " Something went wrong :(");
        throw error;
    }

    // Add buttons to change years.
    var years = d3.keys(religion[province()]);
    var labels = d3.select("#selector").selectAll("label")
      .data(years).enter()
        .append("label")
          .attr("class", "btn btn-primary")
          .on("click", function(year) { return updateYear(year); })
          .text(function(year) { return year; })
        .append("input")
          .attr("type", "radio")
          .attr("name", "options")
          .attr("autocomplete", "off");

    // Make 1st button active.
    d3.select("#selector").selectAll("label").filter(function(d) {return d == year(); })
      .attr("class", "btn btn-primary active");

    drawMap();

    drawBarchart();
};

/*
* Save new year and update map and barchart.
*/
function updateYear(year) {

  currentYear = year;

  updateYearMap();

  updateBarchart();
};

/*
* Save new province and update barchart.
*/
function updateBarchartProvince(province) {

  currentProvince = province;

  updateBarchart();
}

/*
* Keep track of selected year.
*/
function year() {
  return currentYear;
}

/*
* Keep track of selected province.
*/
function province() {
  return currentProvince;
}
