(function() {
    //start of function
  var app = angular.module('NightLifeMap', ['leaflet-directive']);

app.controller('MainCtrl', ['$scope', '$http', '$window', function($scope,$http,$window){
	
	var businessTemplatify = function(businessName){
		return "<div style='min-width:200px;'><h3>"+businessName+"</h3><p><span><strong>Who's going:<strong></span></p><p><div class='btn btn-primary'>I'm going</div></p></div>"
	}
	
	
	$scope.json = {};
	$scope.searchYelp = function(){
		$http.post($window.location.href, $scope.json).success(function(data){

			//generate array from data
			data.businesses.forEach(function(business,index){
				angular.extend($scope, {									///change center
					        center: {
								lat: data.region.center.latitude,
								lng: data.region.center.longitude,
								zoom: 13
							}
				});
				$scope.markers[index] = {									///append marker to markers
							lat: business.location.coordinate.latitude,
							lng: business.location.coordinate.longitude,
							message: businessTemplatify(business.name),
							focus: true,
							draggable: false
				};
			})
			//array.forEach(location)
			//$scope.markers[index] = array[index]
			
			//in the end, replace markers with marker
			
		}).error(function(err){
			console.log(err);
		})
	}
	// initiate map
    angular.extend($scope, {
        center: {
            lat: 37.78,
            lng: -122.42,
            zoom: 13
        },
		markers:{},		// initiate markers for future appending
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
            scrollWheelZoom: true
        }
	});
	
}]);//end of controller
  //end of function
})();
