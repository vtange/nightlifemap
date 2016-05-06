![alt tag](http://res.cloudinary.com/dmj8qtant/image/upload/c_limit,w_600/v1456084441/gwl76sq07wze0cuuykdz.png)
# nightlifemap
Find local nightlife https://nightlifemap.herokuapp.com/

## Tech
Express, EJS, MongoDB, AngularJS, Jquery, LeafletJS (Angular), Yelp API

## Niceties
![Angular Leaflet Map,](https://github.com/vtange/nightlifemap/blob/master/public/map.js)
Search API with Map marker results, ![Custom Map Theme,](https://github.com/vtange/nightlifemap/commit/e78400023e94cbe3ddb4f0e1691dbe43e806a8eb)
Show User Avatars for Bars,
![Angular ErrSrc](https://github.com/vtange/nightlifemap/blob/master/public/lib/errSrc.js) When Image fails to load for whatever reason

### Details
#### Routes
| GET        | POST           | PUT  | DELETE  |
| ---------- |:--------------:| ----:| -------:|
| Home (Map)  |   Yelp Search(update map)   |      |         |
|            |  Bar (User++,User--)           |  |    |
|            |  Find Bar(by id)           |  |    |
|            |  Get Bar Avatars           |  |    |
#### CSS
 - none

#### JS
 - Map change center, add markers on search 
 ```
        ///change center of map
          angular.extend($scope, {									
					        center: {
								lat: data.region.center.latitude,
								lng: data.region.center.longitude,
								zoom: 13
							}
          });
	      data.businesses.forEach(function(business,index){

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
 ```
 
- use strict mode with Angular. Must do for 'let' to work in Chrome
```
(function() {
"use strict";
    //start of function
var app = angular.module('NightLifeMap', ['leaflet-directive', 'header', 'errSrc']);
```

- Used hashtable-like structure for
```
	// list of businesses returned from Yelp Search
	$scope.searchResults = {};
	
	// list of (lists of users' avatars), indexed in the same index as businesses - used to track users assoc. with bar 
  $scope.searchResultsUsers = [];
```

##### Hindsight
Should just have Bars track Users (add user id and avatar info to bar on add/remove), should've used ```populate``` instead of multiple HTTP requests.
BarSchema [<bar info>,avatars:[string],users:[id]]
