(function() {
    //start of function
  var app = angular.module('header', ['userService']);

app.controller('LoginCtrl', ['$scope', '$http', '$window', 'memory', function($scope, $http, $window, memory){
	$scope.service1 = memory;
	$scope.info = {};
	$scope.showLogin = false;
	$scope.toggleLogin = function(){
		$scope.showLogin = !!($scope.showLogin)?false:true;
	}
    $scope.login = function(){
		$http.post($window.location.href+"login",$scope.info).success(function(data){
			//check if data has a user or not
			if(data.id){
				$scope.service1.user = data;
				$scope.user = data;
			}
			else{
				$scope.message = data.message[0];
			}
			
		}).error(function(err){
			throw err;
		})
		
		
	}
	$scope.logout = function(){
		
	}
}]);//end of controller
  //end of function
})();
