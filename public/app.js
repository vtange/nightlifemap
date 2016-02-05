(function() {
    //start of function
  var app = angular.module('NightLifeMap', ['leaflet-directive']);

app.controller('MainCtrl', ['$scope', '$http', '$window', function($scope,$http,$window){
	$scope.json = {};
	$scope.searchYelp = function(){
		$http.post($window.location.href, $scope.json).success(function(data){
			console.log(data);
		}).error(function(err){
			console.log(err);
		})
	}
	// make map
    angular.extend($scope, {
        san_fran: {
            lat: 37.78,
            lng: -122.42,
            zoom: 13
        },
        events: {},
        layers: {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'https://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
	});
	
}]);//end of controller
  //end of function
})();
