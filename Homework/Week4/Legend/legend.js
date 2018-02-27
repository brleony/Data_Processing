/*
Name: Leony Brok
Student number: 10767215

To create the legend you will append a rectangle and a text element for each entry to an SVG element using the D3 library.
*/

// wait until DOM has loaded
if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function() {
        main();
  });
}

function main() {
  console.log("hihi");

  // determine svg attributes
  var margin = {top: 20, right: 40, bottom: 30, left: 40},
      height = 400 - margin.top - margin.bottom,
      width = 600 - margin.right - margin.left

  // set chart height and width
  var chart = d3.select(".chart")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.right + margin.left)
}
