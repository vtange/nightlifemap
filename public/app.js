(function() {
    //start of function
  var app = angular.module('NightLifeMap', []);

app.controller('MainCtrl', ['$scope', '$http', '$window', function($scope,$http,$window){
	$scope.json = {};
	$scope.searchYelp = function(){
		$http.post($window.location.href, $scope.json).success(function(data){
			console.log(data);
		}).error(function(err){
			console.log(err);
		})
	}
	
	
	
}]);//end of controller
  //end of function
})();
