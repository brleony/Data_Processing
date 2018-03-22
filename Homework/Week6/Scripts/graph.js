/**
* Name: Leony Brok
* Student number: 10767215
**/

currentYear = 2010;
currentProvince = "Nederland";

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {

    // get data from files
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

function createGraph(error) {

    // alert if error
    if (error) {
        alert(error + " Something went wrong :(");
        throw error;
    }

    drawMap(nld, religion);

    drawBarchart(religion);
};

function updateYear(year) {

  /*parseTime = d3.timeParse("%Y");
  var year = parseTime(year);*/

  currentYear = year;
  updateYearMap();
  updateBarchart();
};

function updateProvince(province) {
  currentProvince = province;
  updateBarchart();
}

function year() {
  return currentYear;
}

function province() {
  return currentProvince;
}
