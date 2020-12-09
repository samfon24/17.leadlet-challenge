//  Creating Map object
var myMap = L.map("map", {
    center: [23.6345, -103.5528],
    zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Load geojson data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(magnitude) {
    return magnitude * 5;
}

//   Color radius
d3.json(link).then(function (data) {
    function styleInfo(features) {
        return {
            opacity: 0.8,
            fillOpacity: 0.7,
            fillColor: getColor(features.properties.mag),
            radius: markerSize(features.properties.mag),
            stoke: false,
            weight: 0.4
        };
    }

    // change color based on magnitude
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return '#d62727';
            case magnitude > 4:
                return '#e37c27';
            case magnitude > 3:
                return '#f2a30c';
            case magnitude > 2:
                return '#ebca09';
            case magnitude > 1:
                return '#d0e809';
            default:
                return '#96e805';
        }
    }

    // Determine radius for markers

    // GeoJSON Data (circles)
    L.geoJson(data, {
        // create circles
        pointToLayer: function (features, latlng) {
            return L.circleMarker(latlng, {
                radius: 7
            });
        },
        style: styleInfo,
        onEachFeature: function (features, layer) {
            layer.bindPopup("Magnitude: " + features.properties.mag + "<br>Location: " + features.properties.place);
        }
    }).addTo(myMap);

    // add legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            '#96e805',
            '#d0e809',
            '#ebca09',
            '#f2a30c',
            '#e37c27',
            '#d62727'
        ];

        // LOOP Through
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+")
        }
        return div;
    }

    // add legend to map
    legend.addTo(myMap);
})
