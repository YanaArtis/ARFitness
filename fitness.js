GeoLog = new Mongo.Collection('geo_log');

if (Meteor.isClient) {

UpdateGeo = function (){
// var handle = Deps.autorun(function () {
 var userId = Meteor.userId();
 var location = Geolocation.currentLocation();
 if (!location)
  return;

 var geoId = GeoLog.findOne({timestamp: location.timestamp, userId: userId},{fields:{_id:1}});
 console.log('UpdateGeo event ', location, geoId, Session.get('fitActivity'), Session.get('fitness'), Session.get('fitstart'), Session.get('fitstop'), Session.get('fitnessTrackId') );
 if ((!geoId)||Session.get('fitness')){
  var uuid = Meteor.uuid();
  var device = 'browser';
  UpdateGeoDB(location, uuid, device);
 }
 return location;
};


Template.map.rendered = function() {
  L.Icon.Default.imagePath = 'packages/mrt_leaflet/images';

  var map = L.map('map', {
    doubleClickZoom: false
  }).setView([49.25044, -123.137], 13);

  L.tileLayer.provider('Thunderforest.Outdoors').addTo(map);

  UpdateGeo();
/*
  // callback function which has a location object argument
  var GeolocationCallback = function(location) {
    GeoLog.insert(location);
    console.log(location);
//    map.setView(location, 13);
  };

  // one time call to get the location
  GeolocationFG.get(GeolocationCallback);

  // auto-re-run by Cordova every ~30000 ms (30 sec)
  var watchId = GeolocationFG.watch(GeolocationCallback, 30000, {
    maximumAge: 3000,
    enableHighAccuracy: true
  });

  GeolocationFG.clearWatch(watchId);
*/

//  var location = GeoLocation.currentLocation();
//  console.log(location);

};
}