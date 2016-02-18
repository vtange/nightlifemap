(function() {
    //start of function
  var app = angular.module('NightLifeMap', ['leaflet-directive', 'header']);

app.controller('MainCtrl', ['$scope', '$http', '$window', 'memory', function($scope,$http,$window, memory){
	$scope.service1 = memory;
	
	var businessTemplatify = function(businessName,index){
			return "<div style='min-width:200px;'><h3>"+businessName+"</h3><p><strong><span id='barUsersList'>Who's going:</span><strong></p><p data-ng-if='service1.user'><div id='addBar-btn' class='btn btn-primary' data-ng-if='hasBar("+index+")===false' data-ng-click='addBar("+index+",service1.user)'>I'm going</div><div id='remBar-btn' class='btn btn-danger' data-ng-if='hasBar("+index+")===true' data-ng-click='removeBar("+index+",service1.user)'>I'm outta here</div></p></div>"
	}
	
	$scope.hasBar = function(index){	// determines if it's a add or remove bar button
		var user = $scope.service1.user;
		if(user){
			let bar = $scope.searchResults[index];
			function hasBar(){
				for(let i=0;i<user.bars.length;i++){
					for(let prop in user.bars[i]){
						if(user.bars[i][prop]===bar){
							return true;
						}
					}
				}
				return false;
			}
			return hasBar();	//return true if not no bar
		}
		return undefined;	//returning false will show add bar button
	}

	$scope.addBar = function(index, user){
		let bar = $scope.searchResults[index];
		let info = {bar_id:bar,user:user};
		$http.post($window.location.href+'addbar', info).success(function(data){
			user.bars.push(data)
			console.log("added you to the bar");
		})
		
		//add user avatar to list
		document.getElementById('barUsersList');
		
	}
	$scope.removeBar = function(index, user){
		let bar = $scope.searchResults[index];
		let info = {bar_id:bar,user:user};
		function findBarinUser(bar, user){
					let index = -1;
					for (let i=0;i<user.bars.length;i++){
						//find a bar within user.bars that has the id of the bar we want to remove
						if(bar === user.bars[i].id){
							return i;
						}
					}
					return index;
				}
		$http.post($window.location.href+'rembar', info).success(function(data){
			user.bars.splice(findBarinUser(bar,user),1)
			console.log("removed you from the bar");
		})

		//add user avatar to list
		document.getElementById('barUsersList');
		
	}	
	$scope.json = {};
	$scope.searchResults = {};
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
				$scope.searchResults[index]= business.id
				$scope.markers[index] = {									///append each marker to markers
							lat: business.location.coordinate.latitude,
							lng: business.location.coordinate.longitude,
							message: businessTemplatify(business.name, index),
							getMessageScope: function() {return $scope; },
							focus: true,
							draggable: false
				};
			})

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
                    url: 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',
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
