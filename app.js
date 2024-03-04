var map = L.map("map").setView([46, 20], 4.5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//load the data from the geojson file

fetch("geoson.json")
  .then((response) => response.json())
  .then((data) => {
    for (let mobility in data) {
      console.log(data[mobility]);
    }
    for (let key in data) {
      // Access each mobility event
      let mobility = data[key];
      // Define custom icon
      let customIcon = L.divIcon({
        className: "my-custom-icon",
        html: `<div><span>${mobility.participants}</span></div>`,
      });

      // Define marker with custom icon
      let marker = L.marker(
        [parseFloat(mobility.latitude), parseFloat(mobility.longitude)]
        // ,
        // {
        //   icon: customIcon,
        // }
      );

      // Add marker to the map
      marker.addTo(map);

      // add an image to the popup
      let div =
        "<div style='width:150px; display: flex; flex-direction:column; justify-content: center; align-items: center;'>" +
        "<img style='max-width: 150px; max-height: 150px; margin-right:5px' alt='" +
        mobility.name +
        "' src='" +
        mobility.image +
        "'>" +
        "<h3 style='word-wrap: break-word;'>" + mobility.city + "-" +
        mobility.name +
        "</h3>" +
        "</div>";

      // Add popup to the marker with the div
      marker.bindPopup(div);

      // Update marker icon based on zoom level
      map.on("zoomend", function () {
        if (map.getZoom() >= 8) {
          // Check if zoom level is greater than or equal to 8
          // Remove existing marker
          map.removeLayer(marker);
          // Create new marker with default icon
          marker = L.marker([
            parseFloat(mobility.latitude),
            parseFloat(mobility.longitude),
          ]).addTo(map);
          // Bind popup to the new marker
          marker.bindPopup(div);
        } else {
          // Remove existing marker
          map.removeLayer(marker);
          // Create new marker with custom icon
          marker = L.marker(
            [parseFloat(mobility.latitude), parseFloat(mobility.longitude)]
            // ,
            // {
            //   icon: customIcon,
            // }
          ).addTo(map);
          // Bind popup to the new marker
          marker.bindPopup(div);
        }
      });
    }
  });
