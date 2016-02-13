(function() {
    //start of function
  var app = angular.module('userService', []);
	
app.factory('memory', function(){

  var storage = {};
 storage.user = "hello";
	
  return storage;
});//end of service
	
  //end of function
})();

