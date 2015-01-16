UpdateGeo = function (){
// var handle = Deps.autorun(function () {
	var userId = Meteor.userId();
	var location = Geolocation.currentLocation();
	if (!location) {
		console.log('UpdateGeo event no location'); 
		return;
	}

	var geoId = GeoLog.findOne({timestamp: location.timestamp, userId: userId},{fields:{_id:1}});
	console.log('UpdateGeo event ', location, geoId, Session.get('fitActivity'), Session.get('fitness'), Session.get('fitstart'), Session.get('fitstop'), Session.get('fitnessTrackId') );
	if ((!geoId)||Session.get('fitness')){
		var uuid = Meteor.uuid();
		var device = 'browser';
		UpdateGeoDB(location, uuid, device);
	}
	return location;
};

UpdateGeoDB = function(location, uuid, device){
	var userId = Meteor.userId();
	var geoId = GeoLog.findOne({timestamp: location.timestamp, userId: userId},{fields:{_id:1}});
		
	console.log('UpdateGeoDB ',  location, Session.get('fitActivity'), Session.get('fitness'), Session.get('fitstart'), Session.get('fitstop'), Session.get('fitnessTrack') );

	if (Session.get('fitness')){
		if (!Session.get('fitnessTrack')) {
			return;
		}
		Tracks.insert({
			location: location,
			uuid: Meteor.uuid(),
			device: 'browser',
			userId: Meteor.userId(),
			created: new Date(),
			activityId: Session.get('fitActivity'),
			interval: Session.get('interval'),
			fitnessTrackId: Session.get('fitnessTrack')._id,		
		});		
	}
	
	if ((!Session.get('fitnessTrack'))&&(!geoId)){
		GeoLog.insert({
			location: location,
			uuid: uuid,
			device: device,
			userId: userId,
			created: new Date(),
			timestamp: location.timestamp,
			interval: Session.get('interval'),
		});	
//		addPlace(location);
	} 
};