var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";



// // Store our API endpoint inside queryUrl
// var queryUrl3 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
// // Perform a request to retrieve the Geo json from the query URL
d3.json(queryUrl, function(data) {
  // send the data.features object to the cr_Features function.
  console.log(data)
  cr_Features(data.features);
});
// Function to create features using the earthquake data.
function cr_Features(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3>" + feature.properties.mag + "<hr><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: fillColor(feature.properties.mag),
        color: "black",
        weight: 0.6,
        opacity: 0.4,
        fillOpacity: 0.6
      });
      },
      // Create popups
      onEachFeature: function (feature, layer) {
        return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
      }
    });
    // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

mapbox://styles/tomoftheworld/ck1bgn5ev0hxr1clc0x6q1jq0
//create  map layers.
function createMap(earthquakes) {
  // streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
//darkmap layer
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  // baseMaps layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

//Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };
  var myMap = L.map("map", {
    center: [
      40.22, -74.75
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });
  // layer control
 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
//legend


var legend = L.control({ position: 'bottomright'});

  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0,1,2,3,4,5,6],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + fillColor(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }
    return div;
};
// Add legend to the map
legend.addTo(myMap);
  };
// Set magnitude colors by intensity of quake
function fillColor(magnituge) {
    switch (true) {
      case magnituge >= 6.0:
        return 'red';
        break;
      
      case magnituge >= 5.0:
        return 'orange';
        break;

      case magnituge >= 4.0:
        return 'yellow';
        break;
      
      case magnituge >= 3.0:
        return 'green';
        break;

      case magnituge >= 2.0:
        return 'blue';
        break;

      case magnituge >= 1.0:
        return 'purple';
        break;

      default:
        return 'greenyellow';
    };
};

// Reflect the quake magnitude
function markerSize(magnituge) {
  return magnituge*3;
}
