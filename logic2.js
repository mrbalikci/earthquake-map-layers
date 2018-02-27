var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

console.log(queryUrl)
// Perform a GET request to the query URL
var quakeMarkers = []

d3.json(queryUrl, function (data) {

    for (var i = 0; i < data.features.length; i++) {

        var location = data.features[i].geometry.coordinates;
        var info = data.features[i].properties.place;
        var date = data.features[i].properties.time;
        var size = data.features[i].properties.mag;

        function getColor(d) {
            return d > 7 ? '#800026' :
                d > 6 ? '#BD0026' :
                    d > 5 ? '#E31A1C' :
                        d > 4 ? '#FC4E2A' :
                            d > 3 ? '#FD8D3C' :
                                d > 2 ? '#FEB24C' :
                                    d > 1 ? '#FED976' :
                                        '#FFEDA0';
        }

        quakeMarkers.push(
            L.circle(([location[1], location[0]]), {
            stroke: false,
            fillColor: getColor(size),
            fillOpacity: .75,
            radius: 40
        }))
    }
})

console.log(`markers ` + quakeMarkers)

var satellite = L.tileLayer(
    "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?" +
    "access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
    + "RXRxgZ1Mb6ND-9EYWu_5hA");

var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
    + "RXRxgZ1Mb6ND-9EYWu_5hA");

var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibXJiYWxpa2NpIiwiYSI6ImNqZGhqeWFxdTEwamgycXBneTZnYjFzcm0ifQ."
    + "RXRxgZ1Mb6ND-9EYWu_5hA");

var quakes = L.layerGroup(quakeMarkers)

// console.log(quakes)

var baseMaps = {
    "Satellite Map": satellite,
    "Street Map": streetmap,
    "Dark Map": darkmap
};

var overlayMaps = {
    "Earthquakes": quakes,
}

var myMap = L.map("map", {
    center: [14.60, -28.67],
    zoom: 2,
    layers: [satellite, quakes]
  });

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Legend Work 
function getColor(d) {
    return d > 7 ? '#800026' :
        d > 6 ? '#BD0026' :
            d > 5 ? '#E31A1C' :
                d > 4 ? '#FC4E2A' :
                    d > 3 ? '#FD8D3C' :
                        d > 2 ? '#FEB24C' :
                            d > 1 ? '#FED976' :
                                '#FFEDA0';
}

var legend = L.control({ position: 'bottomright' })

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
}
legend.addTo(myMap)