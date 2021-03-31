var mymap = L.map('mapid').setView([50.27264, 7.26469], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mymap);
var arrCoords = [];
async function onMapClick(e) {
  alert("You clicked the map at " + e.latlng.lat +' '+ e.latlng.lng );
  arrCoords.push(`${e.latlng.lng},${e.latlng.lat}`);
  if (arrCoords.length === 2) {
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/foot-hiking?api_key=5b3ce3597851110001cf62484a7a6137e035499bb536ba601a7aea06&start=${arrCoords[0]}&end=${arrCoords[1]}`);
    const geo = await response.json();
    console.log(geo.features[0].geometry.coordinates[0][0]);
    L.marker([geo.features[0].geometry.coordinates[0][1],geo.features[0].geometry.coordinates[0][0]]).addTo(mymap);
    L.marker([geo.features[0].geometry.coordinates[geo.features[0].geometry.coordinates.length-1][1],geo.features[0].geometry.coordinates[geo.features[0].geometry.coordinates.length-1][0]]).addTo(mymap);
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
