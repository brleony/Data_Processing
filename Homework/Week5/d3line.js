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

    d3.json("bmi.json", function(error, data) {

        if (error) {
            console.log(error);
        }

        // let's have a look at what data is...
        console.log(data);

        // demonstration of how to access the data
        console.log(data["fact"][612]["Value"]);
    });
}
