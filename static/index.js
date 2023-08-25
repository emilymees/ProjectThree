//Connects to flask

// let data1="http://127.0.0.1:5000/"
// var L = window.L
let myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 3
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json("/data").then(function(data) {
  console.log(data)

  // Create an empty array to store circle markers for each year
  let circleMarkers =[]

  // Function to clear existing circle markers from the map
  function clearCircleMarkers() {
    circleMarkers.forEach(marker => myMap.removeLayer(marker));
    circleMarkers.length = 0; // Clear the array
      }

// Function to create/update circle markers based on data
  function createCircleMarkers(data) {
    data.forEach(markerData => {
      const circleMarker = L.circleMarker([markerData.latitude, markerData.longitude], {
        radius: Math.sqrt(markerData.fire_size)/20,
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.5
      }).addTo(myMap);

      circleMarker.bindPopup(`<h3> Fire Name: ${markerData.fire_name}</h3><hr>
      <h3> Cause Classification: ${markerData.nwcg_cause_classification}</h3><hr>
      <h3> Cause Description: ${markerData.cause_description}</h3><hr>
      <h3> Acres Burned: ${markerData.fire_size}</h3><hr>
      <p>Date of discovery: ${markerData.fire_discovery_date}</p>
      `);
      circleMarkers.push(circleMarker);
      });
    }

  function createPieChart(data) {
      const causeCounts = {};
    
      data.forEach(item => {
        const cause = item.cause_description;
        if (causeCounts[cause]) {
          causeCounts[cause]++;
        } else {
          causeCounts[cause] = 1;
        }
      });
    
      const pieLabels = Object.keys(causeCounts);
      const pieData = Object.values(causeCounts);
    
      // Access the canvas element
      const pieChartCanvas = document.getElementById("pieChart")
      
        // window.pieChart.data.datasets[0].data = pieData;
        // window.pieChart.update();
      // } else {
        Plotly.newPlot(pieChartCanvas, [{
          type: 'pie',
          labels: pieLabels,
          values: pieData,
          marker:{ 
            colors:  ["aliceblue", "antiquewhite", "#aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","aqua"],
            },
          }])
        }
  // Function to update map data based on the selected year
  function updateMapData(selectedYear) {
    clearCircleMarkers();

    // Filter data for the selected year
    const selectedMarkers = data.filter(d => d.year === selectedYear);
    const selectedData = data.filter(item => item.year === selectedYear);

    // Create/update circle markers
    createCircleMarkers(selectedMarkers);
    createPieChart(selectedData);
  }
  // Get the dropdown select element
  const yearSelect = document.getElementById("year-select");

  // Add an event listener to handle selection
  yearSelect.addEventListener("change", function() {
    const selectedYear = parseInt(yearSelect.value);
    updateMapData(selectedYear);
  });

  // Populate the dropdown with options
  const uniqueYears = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);
  uniqueYears.forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
  });

});

  // Create new circle markers for the selected year
//   data.forEach(markerData => {
//     if (markerData.year === selectedYear) {
//       const circleMarker = L.circleMarker([markerData.latitude,markerData.longitude], {
//         radius:  Math.sqrt(markerData.fire_size)/20,
//         color: 'blue',
//         fillColor: 'blue',
//         fillOpacity: 0.8
//       }).addTo(myMap);
//       circleMarker.bindPopup(`<h3>${markerData.fire_name}</h3><hr><p>${new Date(markerData.fire_discovery_date)}</p>`);
//       circleMarkers.push(circleMarker);
    
//   });
// }



//Empty array to store all years for the dropdown
//   let years = []

//   for (let i = 0; i < data.length; i++) {

//     years.push(data[i].year)


  
// }
// console.log(years)

// // Create a Set to store unique years
// const uniqueYears = new Set(years);

// // Convert the Set back to an array and sort it
// const uniqueYearsArray = Array.from(uniqueYears).sort((a, b) => a - b);

// // Populate the dropdown with options
// uniqueYearsArray.forEach(year => {
//   const option = document.createElement("option");
//   option.value = year;
//   option.text = year;
//   yearSelect.appendChild(option);
// });

//   // Add an event listener to handle selection
// yearSelect.addEventListener("change", function() {
//   const selectedYear = yearSelect.value;
//   updateMapData(selectedYear);
// //   // Do something with the selected year, such as updating the map data
// //   console.log("Selected year:", selectedYear);
  
//   })
//   L.circleMarker([data[i].latitude,data[i].longitude], {
//     fillOpacity: 0.90,
//     fillColor: "red",
//     color:"white",
//     // Adjust the radius.
//     radius: Math.sqrt(data[i].fire_size)/20
//   }).bindPopup(`<h3>${data[i].fire_name}</h3><hr><p>${new Date(data[i].fire_discovery_date)}</p>`).addTo(myMap);

//  });