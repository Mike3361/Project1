Backendless.initApp("7B93C889-5309-F425-FF2A-B39F7B5AE100","F89B1CF6-AB1D-AAD8-FF73-DFCD2A226100");

var watchID;
var poly;
var map;

var locationOptions = { 
	maximumAge: 10000, 
	timeout: 6000, 
	enableHighAccuracy: true 
};



//when the jQuery Mobile page is initialised
$(document).on('pageinit', function() {
	
    console.log("Ready");
    
  
    
    Backendless.Data.of("Position").find().then(append).catch(error);
	updatePosition();
    
});



//Call this function when you want to watch for chnages in position
function updatePosition() {
	
    console.log("updatePosition");

	//instruct location service to get position with appropriate callbacks
	watchID = navigator.geolocation.getCurrentPosition(successPosition, failPosition, locationOptions);
}

//Call this function when you want to watch for chnages in position
function stopPosition() {
	
	//change time box to show updated message
	$('#time').val("Press the button to get location data");
	
	//instruct location service to get position with appropriate callbacks
	navigator.geolocation.clearWatch(watchID);
}


//called when the position is successfully determined
function successPosition(position) {
	
	
	//lets get some stuff out of the position object
	var time = position.timestamp;
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

   
    initMap(latitude, longitude);
	
}

//called if the position is not obtained correctly
function failPosition(error) {
	//change time box to show updated message
	$('#time').val("Error getting data: " + error);
	
}

function initMap(latitude, longitude) {
    
    console.log("initMap");

    
    
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: {lat: latitude, lng: longitude}  // Center the map on Worcester, UK.
  });
    
    
    
    var infoWindow = new google.maps.InfoWindow({map: map});
    
     var pos = {
              lat: latitude,
              lng: longitude
            };
    
   console.log(pos.lat);
              var marker= new google.maps.Marker({
                  position:pos,                                               // make a mark on the map
                  map:map,
                  
              });
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
    

  poly = new google.maps.Polyline({
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
  poly.setMap(map);

  // Add a listener for the click event
  map.addListener('click', addLatLng);
    
     
}

function addLatLng(event) {
 
  // Add a new marker at the new plotted point on the polyline.
    
    console.log("Marker");
    

    
  var marker = new google.maps.Marker({
    position: event.latLng,
    title: 'new marker',
    map: map
  });
    
   
    
    var newTask = {};
    newTask = event.latLng;
    var pos = JSON.stringify(newTask);
    alert(pos);

    Backendless.Data.of( "Position" ).save(newTask).then(append).catch(error);
}

function  append(Position) {
   console.log("append");
    
   console.log(Position);
    //add each tasks
    for (var i = 0; i < Position.length; i++) { 
        
        
        console.log(Position[i]);
        var marker = new google.maps.Marker({
            position:{lat: Position[i].lat, lng: Position[i].lng}, 
            map: map
        });
    }
    



}

function error(err) {
     checkConnection();
}

function checkConnection() {
    var networkState = navigator.connection.type;
 
    if(networkState = "none")
 
    alert('Connection type: No network connection');
}
