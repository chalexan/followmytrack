document.addEventListener("DOMContentLoaded", function() {
 var coordArr = [];
//test icon start

      var iconStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 7,
            snapToPixel: false,
            fill: new ol.style.Fill({color: 'black'}),
            stroke: new ol.style.Stroke({
              color: 'white', width: 2
            })
          })
      });

      var routeStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 6, color: [237, 212, 0, 0.8]
        })
      });

//test icon end





var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 11
  })
});

var vectorSource = new ol.source.Vector({
});
var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});
map.addLayer(vectorLayer);

map.on('singleclick', async function (evt) {
 coordArr.push(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
 if (coordArr.length === 2) {
   const firstPoint = coordArr[0];
   const secondPoint = coordArr[1];
   //const response = await fetch(`https://graphhopper.com/api/1/route?point=${secondPoint[1]},${secondPoint[0]}&point=${firstPoint[1]},${firstPoint[0]}&vehicle=hike&debug=true&key=485e7b7c-dcce-43ac-a66c-443bf7f6b796&type=json`); 
   const response = await fetch(`http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219`); 
   const points = await response.json();
   console.log(points.routes[0].geometry); 
   var route = (new ol.format.Polyline({
    factor: 1e6
  }).readGeometry(points.routes[0].geometry, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  }));
  var routeFeature = new ol.Feature({
    type: 'route',
    geometry: route
  });
  routeFeature.setStyle(routeStyle);
  var rS = new ol.source.Vector({
    features: [routeFeature]
  });
  var routeLayer = new ol.layer.Vector({
    source: rS
  });
  map.addLayer(routeLayer);
  }
  var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(evt.coordinate),
        name: 'New Point',
        population: 4000,
        rainfall: 500
      });
  iconFeature.setStyle(iconStyle);

   var vS = new ol.source.Vector({
        features: [iconFeature]
      });

      var iconLayer = new ol.layer.Vector({
        source: vS
      });
  map.addLayer(iconLayer);
    // convert coordinate to EPSG-4326
    console.log(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
});

});
