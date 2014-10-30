'use strict';

angular.module('websoApp')
	.controller('LoginCtrl', function ($cookieStore, $scope, $resource, $location, localStorageService, cfg, $filter) {

/****************** initialization procedure *******************/
	var usernameStorage = localStorageService.get('username');
	var passwordStorage = localStorageService.get('password');

	if(usernameStorage && passwordStorage){
		$scope.username = usernameStorage;
		$scope.password = passwordStorage;
	}

	$scope.isError = false;
	$scope.valueCheckBox = false;
	$scope.isAuthenticated = $cookieStore.get('Authenticated');

	/*if ($scope.isAuthenticated) {
		$scope.username = $cookieStore.get('username');
		$scope.password = $cookieStore.get('password');
	}*/

	if ($scope.isAuthenticated) {
		var token 		  = $cookieStore.get('token');
		var token_timeout = $cookieStore.get('token_timeout');
	}

/****************** Connection procedure ***********************/  
  $scope.verifyLogin = $resource(cfg.urlServices+'db/:action',
      {action:'login.pl', callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}});



  $scope.login = function () {
  	$scope.loading = true;
    // sending login information to the service to validate the authentication 
    var requete = {};
    // if(scope.isAuthenticated){
    // 	requete = {token_s : token, token_timeout_dt : token_timeout};
    // }
    // else{
    	requete = {user_s : $scope.username, password_s : $scope.password};
    //}
	$scope.verifyLogin.get(requete).$promise.then(function(user) {

		if(user.error){
			$scope.loading = false;
			$scope.isError = true;
			$scope.errorMessage = $filter('i18n')(user.error)+((angular.isDefined(user.error_code))? ', n° '+user.error_code : '');
		}
		else {
			if(user.success){
				$scope.loading = false;
				if($scope.valueCheckBox === true){
					localStorageService.set('username', $scope.username);
					//localStorageService.set('password', $scope.password);
				}
				$cookieStore.put('Authenticated', true);
				$scope.isAuthenticated = true;
				$cookieStore.put('username', user.username);
				$cookieStore.put('userRole', user.role);
				$cookieStore.put('token', user.token);
				$cookieStore.put('token_timeout', user.token_timeout);
				$location.path('/home');				
			}
		}
	},
    //error
    function () {
      $scope.errorMessage = $filter('i18n')(cfg.errorConnect);
      $scope.isError = true;

    }
  );
  };


  $scope.releaseError = function() {
    $scope.isError = false;

  }
});