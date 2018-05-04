Backendless.initApp("7B93C889-5309-F425-FF2A-B39F7B5AE100","F89B1CF6-AB1D-AAD8-FF73-DFCD2A226100");

var watchID;
var poly;
var map;

var locationOptions = { 
	maximumAge: 10000, 
	timeout: 6000, 
	enableHighAccuracy: true 
};

var nightStyle = [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ];

var nightOptions = {name: 'Night map'};

    

//when the jQuery Mobile page is initialised
$(document).on('pageinit', function() {
$(document).on("click", "#logout", logout);
	
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

    var nightMapType = new google.maps.StyledMapType(nightStyle,nightOptions);
    
    
    
    
  nmap = new google.maps.Map(document.getElementById('nmap'), {
    zoom: 16,
    center: {lat: latitude, lng: longitude}  // Center the map on Worcester, UK.
   }); 
    
    nmap.mapTypes.set('nightMap',nightMapType);
    
    $("#road").on("click", function() {
        console.log("roadmap clicked");
        nmap.setMapTypeId('roadmap');
    });
    
    $("#maptypebutton").change( function() {
         
        var a = $("#maptypebutton").prop("checked") ? "Normal" : "Night";
         console.log(a);
        
        if(a=="Normal")  {nmap.setMapTypeId('nightMap');}
        else {nmap.setMapTypeId('roadmap');}
        
        
     });
    
    //nmap.setMapTypeId('roadmap');    
    //nmap.setMapTypeId('satellite');
    
    
    var infoWindow = new google.maps.InfoWindow({map: nmap});
    
     var pos = {
              lat: latitude,
              lng: longitude
            };
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

   console.log(pos.lat);
              var marker= new google.maps.Marker({
                  draggable: true,
                  animation: google.maps.Animation.DROP,
                  position:pos,                                               // make a mark on the map
                  map:nmap,
                  icon:image
              });
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
    

  npoly = new google.maps.Polyline({
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  });
  npoly.setMap(nmap);

  // Add a listener for the click event
  nmap.addListener('click', addLatLng);
    
     
}

function addLatLng(event) {
 
  // Add a new marker at the new plotted point on the polyline.
    
    console.log("Marker");
    
  
    var image='bicycle.png';
  var marker = new google.maps.Marker({
    position: event.latLng,
    title: 'new marker',
    map: nmap,
    icon:image
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
        
        var image='bicycle.png';
        console.log(Position[i]);
        var marker = new google.maps.Marker({
            position:{lat: Position[i].lat, lng: Position[i].lng}, 
            map: nmap,
            icon:image
        });
    }
    



}
function logout(){
    console.log("logout");
Backendless.UserService.logout()
 .then( function() {
     window.location.href='index.html';
  })
 .catch( function( error ) {
    checkConnection()
  });
}

function error(err) {
     checkConnection();
}

function checkConnection() {
    var networkState = navigator.connection.type;
 
    if(networkState = "none")
 
    alert('Connection type: No network connection');
}
