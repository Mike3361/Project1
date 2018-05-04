Backendless.initApp("7B93C889-5309-F425-FF2A-B39F7B5AE100","F89B1CF6-AB1D-AAD8-FF73-DFCD2A226100");

$(document).on("pageshow","#retrieve", onPageShow);

function onPageShow() {
	console.log("page shown");
    
	
      
	//run a query
	
    
    $(document).on("click", "#return", search);
   
    
	


} 



function search(user) {
		console.log("search");
        var emailaddress = $("#emailaddress").val();
   Backendless.UserService.restorePassword( emailaddress )
 .then( function() {
       alert("password");
        window.location.href='index.html';
  })
 .catch( function( error ) {
       alert(error)
  }); 



function error(err) {
    checkConnection();
}

function checkConnection() {
    var networkState = navigator.connection.type;
 
    if(networkState = "none")
 
    alert('Connection type: No network connection')
}
}

  
