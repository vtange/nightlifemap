(function() {
    //start of function
  var app = angular.module('NightLifeMap', []);

app.controller('MainCtrl', ['$scope', '$http', function($scope,$http){
	$scope.json = {"one":$scope.location}
	$scope.searchYelp = function(){
		$http.post("/", $scope.json);
	}
	
	
	
}]);//end of controller
  //end of function
})();
