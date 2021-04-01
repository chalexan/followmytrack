
var points = [],
    msg_el = document.getElementById('msg'),
    url_osrm_nearest = '//router.project-osrm.org/nearest/v1/foot/',
    url_osrm_route = '//router.project-osrm.org/route/v1/foot/',
    url_graphhopper = '//graphhopper.com/api/1/route?point=49.932707,11.588051&point=50.3404,11.64705&vehicle=car&debug=true&key=485e7b7c-dcce-43ac-a66c-443bf7f6b796&type=json';
    icon_url = '//cdn.rawgit.com/openlayers/ol3/master/examples/data/icon.png',
    vectorSource = new ol.source.Vector(),
    vectorLayer = new ol.layer.Vector({
      source: vectorSource
    }),
    styles = {
      route: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 6, color: [40, 40, 40, 0.8]
        })
      }),
      icon: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: icon_url
        })
      })
    };

var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    vectorLayer
  ],
  view: new ol.View({
    center: [-5685003, -3504484],
    zoom: 11
  })
});

map.on('click', function(evt){
    var last_point = points[points.length - 1];
    const coord4326 = utils.to4326(evt.coordinate); 
    var points_length = points.push(coord4326);
    utils.createFeature(coord4326);

    if (points_length < 2) {
      msg_el.innerHTML = 'Click to add another point';
      return;
    }

    //get the route

    var point1 = last_point.join();
    var point2 = coord4326.join();
    
    fetch(`https://api.openrouteservice.org/v2/directions/foot-hiking?api_key=5b3ce3597851110001cf62484a7a6137e035499bb536ba601a7aea06&start=8.681495,49.41461&end=8.687872,49.420318`).then(function(r) { 
      return r.json();
    }).then(function(json) {
      // if(json.code !== 'Ok') {
      //   msg_el.innerHTML = 'No route found.';
      //   return;
      // }
      msg_el.innerHTML = 'Route added';
      //points.length = 0;
      console.log(json);
      //utils.createRoute();
      var vectorSource2 = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json),
      });
      
      
      var vectorLayer2 = new ol.layer.Vector({
        source: vectorSource2,
        style: styles.route,
      });
  
      map.addLayer(vectorLayer2);
    });
    });


var utils = { createFeature: function(coord) {
    var feature = new ol.Feature({
      type: 'place',
      geometry: new ol.geom.Point(ol.proj.fromLonLat(coord))
    });
    feature.setStyle(styles.icon);
    vectorSource.addFeature(feature);
  },
  createRoute: function(polyline) {
    // route is ol.geom.LineString
    var route = new ol.format.Polyline({
      factor: 1e5
    }).readGeometry(polyline, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    var feature = new ol.Feature({
      type: 'route',
      geometry: route
    });
    feature.setStyle(styles.route);
    vectorSource.addFeature(feature);
  },
  to4326: function(coord) {
    return ol.proj.transform([
      parseFloat(coord[0]), parseFloat(coord[1])
    ], 'EPSG:3857', 'EPSG:4326');
  }
};
