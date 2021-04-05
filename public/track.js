const trackId = document.getElementById('trackId').value;
const startPos = document.getElementById('startPos').value;
const endPos = document.getElementById('endPos').value;
const startPosH = document.getElementById('startPosH').value;
const endPosH = document.getElementById('endPosH').value;
const sLon = document.getElementById('sLon').value;
const sLat = document.getElementById('sLat').value;
const eLon = document.getElementById('eLon').value;
const eLat = document.getElementById('eLat').value;
const ascArea = document.getElementById('asc-area');
const descArea = document.getElementById('desc-area');

var mymaps = L.map('mapid2').setView([sLat, sLon], 10);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mymaps);

async function getGeoJson() {
  const response = await fetch(`https://api.openrouteservice.org/v2/directions/foot-hiking?api_key=5b3ce3597851110001cf62484a7a6137e035499bb536ba601a7aea06&start=${startPos}&end=${endPos}`);
  const hopper = await fetch(`https://graphhopper.com/api/1/route?point=${startPosH}&point=${endPosH}&vehicle=hike&debug=true&key=485e7b7c-dcce-43ac-a66c-443bf7f6b796&type=json`)
  const geo = await response.json();
  const gh = await hopper.json();
  console.log(gh.paths[0]);
   ascArea.innerText = Math.floor(gh.paths[0].ascend) + ' m ';
   descArea.innerText = Math.floor(gh.paths[0].descend) + ' m ';
   L.marker([geo.features[0].geometry.coordinates[0][1],geo.features[0].geometry.coordinates[0][0]]).addTo(mymaps);
   L.marker([geo.features[0].geometry.coordinates[geo.features[0].geometry.coordinates.length-1][1],geo.features[0].geometry.coordinates[geo.features[0].geometry.coordinates.length-1][0]]).addTo(mymaps);
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

document.addEventListener('click', async (event) => {
  if (event.target.id === 'share-link') {
    const getShareLink = await fetch(`/share/${event.target.dataset.tid}`);
    const sLink = await getShareLink.text();
    console.log(sLink);
    event.target.href = `${sLink}`;
    event.target.innerText = `${sLink}`;
    event.target.id = 'sLink';
  }

  if (event.target.dataset.id) {
    async function getGPX() {
      const ftch = await fetch('https://api.openrouteservice.org/v2/directions/foot-hiking/gpx', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': '5b3ce3597851110001cf62484a7a6137e035499bb536ba601a7aea06'},
        body: JSON.stringify({ "coordinates":[[sLon, sLat],[eLon, eLat]] }),
      });
      const answer = await ftch.text();
      const resp = await fetch(`/gpx/${trackId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'gpx': answer }),
      });
      const link = await resp.text();
      document.querySelector('.get-gpx-link').remove();
      document.querySelector('#download-link').style.visibility = "visible";
      document.querySelector('#download-link').href = link;
      return;
    }
     getGPX();
  }
})
