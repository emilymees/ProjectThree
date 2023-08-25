L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapContainer);

  // Fetch data from Flask route
  fetch("/getWildfiresData")
    .then(response => response.json())
    .then(data => {
      data.forEach(entry => {
        // Create a marker with a label for each event
        L.marker([entry.Latitude, entry.Longitude]).addTo(mapContainer)
          .bindPopup(`Year: ${entry.Year}<br>Count: ${entry.Count}`)
          .openPopup();
      });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
});