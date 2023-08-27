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

// Highcharts.setOptions({
//   colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
// });

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


// Bar chart for Number of Acres Burned per Year
  function createBarChart(data) {
    const states = [...new Set(data.map(item => item.state))]; // Get unique years

    const totalAcres = {};

    states.forEach(state => {
      const acres = data.filter(item => item.state === state).reduce(function(i, j) {
        return i = j.fire_size;
      }, 0);
      totalAcres[state] = acres;
    })
    
    const barChartContainer = document.getElementById("acreChart");


    Highcharts.chart(barChartContainer, {
      chart: {
        type: "bar",
        borderRadius: '10px'
      },
      legend: {
        enabled: false
      },
      title: {
        text: "Total Acres Burned per State per Year"
      },
      xAxis: {
        categories: states,
        title: {
          text: "State"
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Number of Acres Burned"
        },
      },
      series: [
        {
          name: "Acres Burned",
          data: Object.values(totalAcres),
          color: "#64508C", // Customize color
        },
      ],
    });
  }

  function createColChart(data) {
    const states = [...new Set(data.map(item => item.state))]; // Get unique years
    const fireCounts = {};

    states.forEach(state => {
      const count = data.filter(item => item.state === state).length;
      fireCounts[state] = count;
    });

    const colChartContainer = document.getElementById("numberChart");

    Highcharts.chart(colChartContainer, {
      chart: {
        type: "column",
        borderRadius: '10px'
      },
      legend: {
        enabled: false
      },
      title: {
        text: "Number of Fires per State per Year",
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
          color: "#5F7896", // Customize color
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
    createColChart(selectedData)
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
  div.innerHTML += "<h4>Size of Fire (Acres)</h4>";
  div.innerHTML += '<i style="background: #F7C19C"></i><span>5,000 - 50,000</span><br>';
  div.innerHTML += '<i style="background: #FF948C"></i><span>50,000 - 100,000</span><br>';
  div.innerHTML += '<i style="background: #F84B41"></i><span>100,000 - 150,000</span><br>';
  div.innerHTML += '<i style="background: #C70075"></i><span>150,000 - 200,000</span><br>';
  div.innerHTML += '<i style="background: #6F0032"></i><span>+ 200,000</span><br>';
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