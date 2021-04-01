const trackId = document.getElementById('trackId').value;
const startPos = document.getElementById('startPos').value;
const endPos = document.getElementById('endPos').value;
const sLon = document.getElementById('sLon').value;
const sLat = document.getElementById('sLat').value;

var mymaps = L.map('mapid2').setView([sLat, sLon], 10);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mymaps);

async function getGeoJson() {
  const response = await fetch(`https://api.openrouteservice.org/v2/directions/foot-hiking?api_key=5b3ce3597851110001cf62484a7a6137e035499bb536ba601a7aea06&start=${startPos}&end=${endPos}`);
  const geo = await response.json();
  var myLines = [{
    "type": "LineString",
    "coordinates": geo.features[0].geometry.coordinates
}, {
    "type": "LineString",
    "coordinates": []
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

L.geoJSON(myLines, {
    style: myStyle
}).addTo(mymaps);
}

getGeoJson();
