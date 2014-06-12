var app = angular.module('musicApp', []);

app.controller('MusicListCtrl', function($scope, Facebook) {
	
	 $scope.getMusic = function() {
       $scope.music = Facebook.getMusicPics(FB, "");
	}
	
	$scope.getMusicDetails = function(bandId) {
      $scope.details = Facebook.getMusicDetails(FB, bandId);
	}
	
	$scope.getAdditionalMusic = function(pagingUrl){
		$scope.music = Facebook.getMusicPics(FB, pagingUrl);
	}

});

app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover',
                'background-position' : 'center center'
            });
        });
    };
});

app.service('Facebook', function($q, $rootScope) {
  
  // resolving or rejecting a promise from a third-party
  // API such as Facebook must be
  // performed within $apply so that watchers get
  // notified of the change
  resolve = function(errval, retval, deferred) {
    $rootScope.$apply(function() {
      if (errval) {
        deferred.reject(errval);
      } else {
    	retval.connected = true;
        deferred.resolve(retval);
      }
    });
  }
    
  return {
	    getMusicPics: function(FB, pagingUrl) {
	      var deferred = $q.defer();
	      FB.getLoginStatus(function(response) {
	        if (response.status == 'connected') {
	        	if (pagingUrl != "")
	        	{
		          FB.api(pagingUrl, function(response) {
			        	console.log(response);
			            resolve(null, response, deferred);
			          });	        		
	        	}
	        	else
	        	{
		          FB.api('me?fields=music.limit(27)', function(response) {
		        	response = response.music; //keeps graph API results in same format as paging results
		        	console.log(response);
		            resolve(null, response, deferred);
		          });
	        	}
	        } else if (response.status == 'not_authorized') {
	          FB.login(function(response) {
	            if (response.authResponse) {
	              FB.api('/me', function(response) {
	                resolve(null, response, deferred);
	              });
	            } else {
	              resolve(response.error, null, deferred);
	            }
	          });
	        } 
	      });
	      promise = deferred.promise;
	      promise.connected = false;
	      return promise;
	    },
	    getMusicDetails: function(FB, bandId) {
	      var deferred = $q.defer();
	      FB.getLoginStatus(function(response) {
	        if (response.status == 'connected') {
	        	FB.api('/'+bandId+'?fields=about,name,cover', function(response) {
	        		console.log(response);
	            resolve(null, response, deferred);
	          });
	        } else if (response.status == 'not_authorized') {
	          FB.login(function(response) {
	            if (response.authResponse) {
	              FB.api('/me', function(response) {
	                resolve(null, response, deferred);
	              });
	            } else {
	              resolve(response.error, null, deferred);
	            }
	          });
	        } 
	      });
	      promise = deferred.promise;
	      promise.connected = false;
	      return promise;
	    }
	}; 
});