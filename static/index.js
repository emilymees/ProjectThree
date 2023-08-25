//Connects to flask

// let data1="http://127.0.0.1:5000/"
// var L = window.L
let myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function circleColor(fireSize) {
  if (fireSize < 50000) return "#008080";
  else if (fireSize < 100000) return "#e5c850";
  else if (fireSize < 150000) return "#eca1a6";
  else if (fireSize < 200000) return "#d87641";
  else return "#50394c";
};

function getColor(fireCause) {
  colorList = []
  for(i=0; i<fireCause.length; i++){
    if (fireCause [i] === 'Equipment and vehicle use') colorList.push("#F7DC6F");
    else if (fireCause [i] === 'Power generation transmission distribution') colorList.push("#F1C40F");
    else if (fireCause [i] === 'Debris and open burning') colorList.push("#F39C12");
    else if (fireCause [i] === 'Smoking') colorList.push("#EB984E");
    else if (fireCause [i] === 'Recreation and ceremony') colorList.push("#D35400");
    else if (fireCause [i] === 'Arson incendiarism') colorList.push("#CD6155");
    else if (fireCause [i] === 'Fireworks') colorList.push("#E74C3C");
    else if (fireCause [i] === 'Misuse of fire by a minor') colorList.push("#B03A2E");
    else if (fireCause [i] === 'Railroad operations and maintenance') colorList.push("#873600");
    else if (fireCause [i] === 'Firearms and explosives use') colorList.push("#FFBF00");
    else if (fireCause [i] === 'Other causes') colorList.push("red");
    else if (fireCause [i] === "Natural") colorList.push("#3D9C73");}
  return colorList;
};

// var Highcharts = require('highcharts/highstock');  

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
        color: circleColor(markerData.fire_size),
        fillColor: circleColor(markerData.fire_size),
        fillOpacity: 0.7,
        weight: 0.1
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
      console.log(pieLabels);
      // Access the canvas element
      const pieChartCanvas = document.getElementById("pieChart")
      
        // window.pieChart.data.datasets[0].data = pieData;
        // window.pieChart.update();
      // } else {
        // function pieColor(causeData)
        Plotly.newPlot(pieChartCanvas, [{
          type: 'pie',
          labels: pieLabels,
          values: pieData,
          marker:{ 
            colors: getColor(pieLabels),
            },
          }])
        }

  function createBarChart(data) {
    const states = [...new Set(data.map(item => item.state))]; // Get unique years
    const fireCounts = {};

    states.forEach(state => {
      const count = data.filter(item => item.state === state).length;
      fireCounts[state] = count;
    });

    const barChartContainer = document.getElementById("barChart");

    Highcharts.chart(barChartContainer, {
      chart: {
        type: "column",
      },
      title: {
        text: "Number of Fires per Year",
      },
      xAxis: {
        categories: states,
        title: {
          text: "State",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Number of Fires",
        },
      },
      series: [
        {
          name: "Number of Fires",
          data: Object.values(fireCounts),
          color: "rgba(54, 162, 235, 0.8)", // Customize color
        },
      ],
    });
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
    createBarChart(selectedData);
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

var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Number of Acres Burned</h4>";
  div.innerHTML += '<i style="background: #008080"></i><span>5,000 - 50,000</span><br>';
  div.innerHTML += '<i style="background: #e5c850"></i><span>50,000 - 100,000</span><br>';
  div.innerHTML += '<i style="background: #eca1a6"></i><span>100,000 - 150,000</span><br>';
  div.innerHTML += '<i style="background: #d87641"></i><span>150,000 - 200,000</span><br>';
  div.innerHTML += '<i style="background: #50394c"></i><span>+ 200,000</span><br>';
  return div;
};
legend.addTo(myMap);

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