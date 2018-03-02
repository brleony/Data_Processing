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
            console.log(error);
        }

        // let's have a look at what data is...
        console.log(data);

        // ... and this is how you could access it
        console.log(data["Italy"][0]["Employment"]["Part-time"]);
    });
}
