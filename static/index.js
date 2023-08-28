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
  if (fireSize < 50000) return "#F7C19C";
  else if (fireSize < 100000) return "#FF948C";
  else if (fireSize < 150000) return "#F84B41";
  else if (fireSize < 200000) return "#C70075";
  else return "#6F0032";
};

function getColor(fireCause) {
  colorList = []
  for(i=0; i<fireCause.length; i++){
    if (fireCause [i] === 'Equipment and vehicle use') colorList.push("#3c4e4b");
    else if (fireCause [i] === 'Power generation transmission distribution') colorList.push("#466964");
    else if (fireCause [i] === 'Debris and open burning') colorList.push("#599e94");
    else if (fireCause [i] === 'Smoking') colorList.push("#6cd4c5");
    else if (fireCause [i] === 'Recreation and ceremony') colorList.push("#1984c5");
    else if (fireCause [i] === 'Arson incendiarism') colorList.push("#22a7f0");
    else if (fireCause [i] === 'Fireworks') colorList.push("#63bff0");
    else if (fireCause [i] === 'Misuse of fire by a minor') colorList.push("#a7d5ed");
    else if (fireCause [i] === 'Railroad operations and maintenance') colorList.push("#48446e");
    else if (fireCause [i] === 'Firearms and explosives use') colorList.push("#5e569b");
    else if (fireCause [i] === 'Other causes') colorList.push("#776bcd");
    else if (fireCause [i] === "Natural") colorList.push("#a9adb5");}
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

// Function to create/update circle markers based on data using leaflet
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


// Function to create piecharts using plotly
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

  const pieChartCanvas = document.getElementById("pieChart")

    Plotly.newPlot(pieChartCanvas, [{
      type: 'pie',
      title: 'Wildfire Causes <br> per Year',
      labels: pieLabels,
      values: pieData,
      marker:{ 
        colors: getColor(pieLabels),
        },
      legend: 'left',
      hole: .5
      }])
    }




  // function createPieChart(data) {
  //       const causeCounts = {};
      
  //       data.forEach(item => {
  //         const cause = item.cause_description;
  //         if (causeCounts[cause]) {
  //           causeCounts[cause]++;
  //         } else {
  //           causeCounts[cause] = 1;
  //         }
  //       });
    
  //     const pieLabels = Object.keys(causeCounts);
  //     const pieData = Object.values(causeCounts);

  //     // Access the canvas element
  //     const pieChartCanvas = document.getElementById("pieChart")
      
  //       // window.pieChart.data.datasets[0].data = pieData;
  //       // window.pieChart.update();
  //     // } else {
  //       Plotly.newPlot(pieChartCanvas, [{
  //         type: 'pie',
  //         title:{
  //           text:'Wildfire Causes',
  //         },
  //         labels: pieLabels,
  //         values: pieData,
  //         marker:{ 
  //           colors: getColor(pieLabels),
  //           },
  //         }])
  //       }
// Function to create negative stacked bar chart using highcharts.js
  function createNegativeStackedBarChart(data) {
          const states = [...new Set(data.map(item => item.state))]; // Get unique states
          const acresByState = {};
          const firesByState = {};
          
          states.forEach(state => {
            const stateData = data.filter(item => item.state === state);
            
            const totalAcres = stateData.reduce((total, item) => total + item.fire_size, 0);
            const totalFires = stateData.length;
          
            acresByState[state] = totalAcres;
            firesByState[state] = totalFires;
          });
          
          
          const barChartContainer = document.getElementById("negativeBarChart");
          
          Highcharts.chart(barChartContainer, {
            chart: {
              type: "bar",
              width: 600, 
              height: 400, 
            },
            title: {
              text: "Total Acres Burned and Total Fires per State",
            },
            xAxis: {
              categories: states, //Object.keys(acresByState),
              // reversed: false,
              title: {
                text: "State",
              },
            },
            yAxis: {
              title: {
                text: "Value",
              },
            },
            tooltip: {
              shared: true,
            },
            plotOptions: {
              series: {
                stacking: "normal",
              },
            },
            series: [
              {
                name: "Total Acres Burned",
                data: states.map(state => acresByState[state]), //Object.values(acresByState),
                color: "rgba(54, 162, 235, 0.8)", // Customize color
              },
              {
                name: "Total Fires",
                data: states.map(state => firesByState[state]),//Object.values(firesByState).map(count => count),
                color: "rgba(255, 99, 132, 0.8)", // Customize color
              },
            ],
          });
        }
// Function to create a regular bar chart using highcharts.js
//   function createBarChart(data) {
//     const states = [...new Set(data.map(item => item.state))]; // Get unique years
//     const fireCounts = {};

//     states.forEach(state => {
//       const count = data.filter(item => item.state === state).length;
//       fireCounts[state] = count;
//     });

//     const barChartContainer = document.getElementById("barChart");

//     Highcharts.chart(barChartContainer, {
//       chart: {
//         type: "column",
//       },
//       title: {
//         text: "Number of Fires per Year",
//       },
//       xAxis: {
//         categories: states,
//         title: {
//           text: "State",
//         },
//       },
//       yAxis: {
//         min: 0,
//         title: {
//           text: "Number of Fires",
//         },
//       },
//       series: [
//         {
//           name: "Number of Fires",
//           data: Object.values(fireCounts),
//           color: "rgba(54, 162, 235, 0.8)", // Customize color
//         },
//       ],
//     });
//   }
// // Function to create a horizontal bar chart using highcharts.js
//   function createStackedBarChart(data) {
//     const states = [...new Set(data.map(item => item.state))]; // Get unique states
//     const acresByState = {};
  
//     states.forEach(state => {
//       const acres = data
//         .filter(item => item.state === state)
//         .reduce((totalAcres, item) => totalAcres + item.fire_size, 0);
//       acresByState[state] = acres;
//     });
  
//     const stackedBarChartContainer = document.getElementById("stackedBarChart");
  
//     Highcharts.chart(stackedBarChartContainer, {
//       chart: {
//         type: "bar",
//       },
//       title: {
//         text: "Acres Burned by State",
//       },
//       xAxis: {
//         categories: states,
//         title: {
//           text: "State",
//         },
//       },
//       yAxis: {
//         min: 0,
//         title: {
//           text: "Acres Burned",
//         },
//       },
//       tooltip: {
//         pointFormat: "<b>{point.y:.2f} acres</b>",
//       },
//       plotOptions: {
//         bar: {
//           stacking: "normal",
//         },
//       },
//       series: [
//         {
//           name: "Acres Burned",
//           data: states.map(state => acresByState[state]),
//           color: "rgba(54, 162, 235, 0.8)", // Customize color
//         },
//       ],
//     });
//   }





  // Function to update map data based on the selected year
  function updateMapData(selectedYear) {
    clearCircleMarkers();

    // Filter data for the selected year
    const selectedMarkers = data.filter(d => d.year === selectedYear);
    const selectedData = data.filter(item => item.year === selectedYear);

    // Create/update circle markers
    createCircleMarkers(selectedMarkers);
    // createBarChart(selectedData);
    // createStackedBarChart(selectedData);
    createNegativeStackedBarChart(selectedData)
    createPieChart(selectedData)
  }
  // Get the dropdown select element
  const yearSelect = document.getElementById("year-select");
  const counterElement = document.getElementById("counter");

  function updateCounter(selectedYear) {
    const totalWildfires = data.filter(item => item.year === selectedYear).length;
    counterElement.textContent = `Total Wildfires: ${totalWildfires}`;
  }

  // Initial update of the counter based on the default selected year
updateCounter(parseInt(yearSelect.value));

  // Add an event listener to handle selection
  yearSelect.addEventListener("change", function() {
    const selectedYear = parseInt(yearSelect.value);
    updateMapData(selectedYear);
    updateCounter(selectedYear);
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
  div.innerHTML += '<i style="background: #F7C19C"></i><span>5,000 - 50,000</span><br>';
  div.innerHTML += '<i style="background: #FF948C"></i><span>50,000 - 100,000</span><br>';
  div.innerHTML += '<i style="background: #F84B41"></i><span>100,000 - 150,000</span><br>';
  div.innerHTML += '<i style="background: #C70075"></i><span>150,000 - 200,000</span><br>';
  div.innerHTML += '<i style="background: #6F0032"></i><span>+ 200,000</span><br>';
  return div;
};
legend.addTo(myMap);


