(function() {
"use strict";
    //start of function
  var app = angular.module('NightLifeMap', ['leaflet-directive', 'header', 'errSrc']);

app.controller('MainCtrl', ['$scope', '$http', '$window', 'memory', function($scope,$http,$window, memory){
	
	//stores user between header and the map
	$scope.service1 = memory;
	
	//shown per business popup on map
	var businessTemplatify = function(businessName,index){
			return "<div style='min-width:200px;'><h3>"+businessName+"</h3><p><strong><span id='barUsersList'>Who's going:</span><strong><span data-ng-repeat='userAvatar in searchResultsUsers["+index+"]'><img style='max-height:30px;' data-ng-src='{{userAvatar}}' err-src='../images/novatar.png' /></span></p><p data-ng-if='service1.user'><div id='addBar-btn' class='btn btn-primary' data-ng-if='hasBar("+index+")===false' data-ng-click='addBar("+index+",service1.user)'>I'm going</div><div id='remBar-btn' class='btn btn-danger' data-ng-if='hasBar("+index+")===true' data-ng-click='removeBar("+index+",service1.user)'>I'm outta here</div></p></div>";
	};
	
	// for getting bar's user list
	$scope.getBarUsers = function(index){	
		let bar = $scope.searchResults[index];
		let info = {bar_id:bar};
		return $http.post($window.location.href+'findbar',info);	//return http request (a promise)
	};
	
	// checks if user is in this bar already, show grn or red button
	$scope.hasBar = function(index){
		let user = $scope.service1.user;
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
		};
		if(user){
			return hasBar();	//return true there is a logged in user and he/she is in bar
		}
		return undefined;	//returning false will show add bar button
	};

	// add bar to user's bars list, add user to bars list
	// assemble bar and user info in an obj and do a POST request
	$scope.addBar = function(index, user){
		let bar = $scope.searchResults[index];
		let info = {bar_id:bar,user:user};
		$http.post($window.location.href+'addbar', info).success(function(data){
			user.bars.push(data)
			console.log("added you to the bar");
		});
	};
	
	// same as above but reverse
	// assemble bar and user info in an obj and do a POST request
	// remove bar from user's bars list (to change button from grn to red again)
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
				};
		$http.post($window.location.href+'rembar', info).success(function(data){
			user.bars.splice(findBarinUser(bar,user),1)
			console.log("removed you from the bar");
		});
	};
	
	
	// used for form input's data-ng-model
	$scope.json = {};
	
	// list of businesses returned from Yelp Search
	$scope.searchResults = {};
	
	// list of (lists of users' avatars), indexed in the same index as businesses - used to track users assoc. with bar 
	$scope.searchResultsUsers = [];
	
	// tell server to search Yelp. POST request, then:
	///update map
	///for each business:
	////get the list of users who added the bar
	////using that list, build a list of avatar URLs, and push to searchResultsUsers
	$scope.searchYelp = function(){
		$scope.searchResults = {};			//reset old results
		$scope.searchResultsUsers = [];		//reset old results
		$http.post($window.location.href+'search', $scope.json).success(function(data){
			
			///change center of map
				angular.extend($scope, {									
					        center: {
								lat: data.region.center.latitude,
								lng: data.region.center.longitude,
								zoom: 13
							}
				});
			
			//for all businesses
			data.businesses.forEach(function(business,index){
				
				//add business id to an {}, used to identify businesses for future interaction
				$scope.searchResults[index]= business.id;
				
				//get user data per business and put it into a {}
				var promise1 = $scope.getBarUsers(index);
				promise1.then(function(response) {
				//	console.log(response.data);  ==> Array [] for empty bars, Array [ blah , blah ] for populated bars
				  response.data.forEach(function(userID){
				  	//for each array of [ user._ids ], convert to [ user.avatarURLs ]
					let info = {user_id:userID};
				  	var promise2 = $http.post($window.location.href+'avatarColle',info);
				  	promise2.then(function(response){
						if($scope.searchResultsUsers[index]===undefined){
							$scope.searchResultsUsers[index] = [];
						}
						$scope.searchResultsUsers[index].push(response.data);
					})
					.catch(function(err) {
						throw err;
					});
				  });
				})
				.catch(function(err) {
				  throw err;
				});
				
				//marker each business
				$scope.markers[index] = {									///append each marker to markers
							lat: business.location.coordinate.latitude,
							lng: business.location.coordinate.longitude,
							message: businessTemplatify(business.name, index),
							getMessageScope: function() {return $scope; },
							focus: true,
							draggable: false
				};
			});

		}).error(function(err){
			console.log(err);
		});
	};
	
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
                    name: 'CartoDB',
                    url: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            }
        },
        defaults: {
			tileLayer: "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
			tileLayerOptions: {
        		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      		},
            scrollWheelZoom: true
        }
	});
	
}]);//end of controller
  //end of function
})();
