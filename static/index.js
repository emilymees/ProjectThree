//Connects to flask

// let data1="http://127.0.0.1:5000/"
// var L = window.L
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 7
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json("/data").then(function(data) {
  console.log(data)

  let marker_limit = 1000;

  for (let i = 0; i < marker_limit.length; i++) {

    let location = marker_limit[i];
      L.marker([location.latitude[0], location.longitude[0]]).addTo(myMap);
    }

  }

);