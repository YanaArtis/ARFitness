
Template.map.rendered = function() {
	var latitude = 62.19;
	var longitude = -87.91;
	var latlng = L.latLng(latitude, longitude);
	
	var map = L.map('map', {
		doubleClickZoom: false
	}).setView([latitude, longitude], 13);

	L.tileLayer.provider('Thunderforest.Outdoors').addTo(map);
  L.Icon.Default.imagePath = 'packages/mrt_leaflet/images';
	
	Tracker.autorun(function() {
		if (GeoLog.findOne()) {
			var geolog = GeoLog.findOne({}, {sort: {timestamp: -1}});
			console.log('geolog ', geolog);
			var latitude = geolog.location.coords.latitude;
			var longitude = geolog.location.coords.longitude;
			map = map.panTo([latitude, longitude]);
/* 			var map = L.map('map', {
				doubleClickZoom: false
			}).setView([latitude, longitude], 13); */			
			var marker = L.marker([latitude, longitude]).addTo(map);		
			var markers = GeoLog.find({}, {sort: {timestamp: -1}});
			markers.forEach(function(item, index, array){
				console.log(' going through each marker ', item.location.coords);
				marker = L.marker([item.location.coords.latitude, item.location.coords.longitude]).addTo(map)
			});			
		}
	});
/* 	if (GeoLog.findOne({sort: {timestamp: -1}})) {
		var latitude = GeoLog.findOne({}, {sort: {timestamp: -1}}).location.coords.latitude;
		var longitude = GeoLog.findOne({}, {sort: {timestamp: -1}}).location.coords.longitude;
	} else {
		console.error('Geolog came empty ');
		var latitude = 42.19;
		var longitude = -87.91;
	} */
 

	map.on('dblclick', function(event) {
		UpdateGeo();
		var markers = GeoLog.find();
		console.log(' markers ', markers.fetch());
		var geolog = GeoLog.findOne({}, {sort: {timestamp: -1}});
		var latitude = geolog.location.coords.latitude;
		var longitude = geolog.location.coords.longitude;
		map = map.panTo([latitude, longitude]);
	});
	
//	var marker = L.marker([latitude, longitude]).addTo(map);


/*   markers.forEach(function(location){
		marker = L.marker(document.latlng).addTo(map)
  }); */
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

Template.map.helpers({
	lastlog: function(){
		return GeoLog.findOne({userId: Meteor.userId()}, {sort: {timestamp: -1}});
	},
});

Template.coords.helpers({
	geologs: function(){
		return GeoLog.find({userId: Meteor.userId()}, {sort: {timestamp: -1}});
	},
});

Template.footergeo.events({
	
	'click #getNow': function() {
//		UpdateGeo();
		var location =  Geolocation.currentLocation();
		console.log('click #getNow general event ', location, this);
		if (Meteor.isCordova) {
			// cordova
			UpdateGeoCordova();
			return;
		}
		// browser
		UpdateGeo();
	},
});