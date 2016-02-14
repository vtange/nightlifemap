(function() {
    //start of function
  var app = angular.module('NightLifeMap', ['leaflet-directive', 'header']);

app.controller('MainCtrl', ['$scope', '$http', '$window', 'memory', function($scope,$http,$window, memory){
	$scope.service1 = memory;
	
	var businessTemplatify = function(businessName,bar_id){
		var id = bar_id;
		return "<div style='min-width:200px;'><h3>"+businessName+id+"</h3><p><span><strong>Who's going:<strong></span></p><p><div class='btn btn-primary' data-ng-show='service1.user' data-ng-click='addBar("+id+",service1.user)'>I'm going</div></p></div>"
	}
	
	$scope.addBar = function(bar, user){
		console.log(bar);
		console.log(user);
		var info = {bar_id:bar,user:user};
		$http.post($window.location.href+'addbar', info).success(function(data){
			console.log("added you to the bar");
		})
	}
	
	$scope.json = {};
	$scope.searchYelp = function(){
		$http.post($window.location.href+'search', $scope.json).success(function(data){
			//generate array from data
				angular.extend($scope, {									///change center
					        center: {
								lat: data.region.center.latitude,
								lng: data.region.center.longitude,
								zoom: 13
							}
				});
			data.businesses.forEach(function(business,index){
				$scope.markers[index] = {									///append each marker to markers
							lat: business.location.coordinate.latitude,
							lng: business.location.coordinate.longitude,
							message: businessTemplatify(business.name, business.id),
							getMessageScope: function() {return $scope; },
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
