var mymap = L.map('mapid').setView([50.27264, 7.26469], 3);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mymap);

let arrCoords = [];
const startArea = document.getElementById('startArea');
const endArea = document.getElementById('endArea');
const distArea = document.getElementById('distArea');
const timeArea = document.getElementById('timeArea');
const sLon = document.getElementById('sLon');
const sLat = document.getElementById('sLat');

const buttonCont = document.getElementById('button-cont');
const details = document.getElementById('details');

function formatSeconds(seconds) {
  function z(n) { return (n < 10 ? '0' : '') + n; }
  return z(seconds / 3600 | 0) + ':' + z((seconds % 3600) / 60 | 0)
}

async function onMapClick(e) {
  if (arrCoords.length < 2) {
    arrCoords.push(`${e.latlng.lng},${e.latlng.lat}`);
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
    sLon.value = e.latlng.lng;
    sLat.value = e.latlng.lat;
  }
  if (arrCoords.length === 2) {
    startArea.value = arrCoords[0];
    endArea.value = arrCoords[1];
    buttonCont.innerHTML = `<button class="uk-button uk-button-primary" id="mapForm">Save</button>`;
    details.innerHTML = ` <b>Track details:</b>
    <span uk-icon="location"></span><span id="dist-area">distance</span>
    <span uk-icon="clock"></span><span id="time-area">time</span>`;
    const distText = document.getElementById('dist-area');
    const timeText = document.getElementById('time-area');

    const response = await fetch(`https://api.openrouteservice.org/v2/directions/foot-hiking?api_key=5b3ce3597851110001cf62484a7a6137e035499bb536ba601a7aea06&start=${arrCoords[0]}&end=${arrCoords[1]}`);
    const geo = await response.json();

    console.log(geo.features[0].properties.summary);
    distText.innerText = (geo.features[0].properties.summary.distance / 1000) + ' km  ';
    timeText.innerText = formatSeconds(geo.features[0].properties.summary.duration) + ' (hours/min)';
    distArea.value = distText.innerText;
    timeArea.value = timeText.innerText;
// L.marker([geo.features[0].geometry.coordinates[0][1],geo.features[0].geometry.coordinates[0][0]]).addTo(mymap);
// L.marker([geo.features[0].geometry.coordinates[geo.features[0].geometry.coordinates.length-1][1],geo.features[0].geometry.coordinates[geo.features[0].geometry.coordinates.length-1][0]]).addTo(mymap);
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
  }).addTo(mymap);
  }
  
}

mymap.on('click', onMapClick);
