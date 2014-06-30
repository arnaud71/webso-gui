'use strict';

angular.module('websoApp')
	.controller('LoginCtrl', function ($cookieStore, $scope, $resource, $location, localStorageService, cfg) {

/****************** procedure d'initialisation *******************/
	var usernameStorage = localStorageService.get('username');
	var passwordStorage = localStorageService.get('password');

	if(usernameStorage && passwordStorage){
		$scope.username = usernameStorage;
		$scope.password = passwordStorage;
	}

	$scope.isError = false;
	$scope.valueCheckBox = false;
	$scope.isAuthenticated = $cookieStore.get('Authenticated');

	if ($scope.isAuthenticated) {
		$scope.username = $cookieStore.get('username');
		$scope.password = $cookieStore.get('password');
	}

/****************** procedure de connexion ***********************/  
  $scope.verifyLogin = $resource(cfg.urlServices+'db/:action',
      {action:'login.pl', callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});



  $scope.login = function () {
  	$scope.loading = true;
    // envoi d'informations de login au service pour valider l'authentification  
	$scope.verifyLogin.get({user_s : $scope.username, password_s : $scope.password}).$promise.then(function(user) {

		if(user.error){
			$scope.loading = false;
			$scope.isError = true;
			$scope.errorMessage = user.error;
		}
		else {
			if(user.success){
				$scope.loading = false;
				if($scope.valueCheckBox === true){
					localStorageService.set('username', $scope.username);
					localStorageService.set('password', $scope.password);
				}
				$cookieStore.put('Authenticated', true);
				$scope.isAuthenticated = true;
				$cookieStore.put('username', $scope.username);
				$cookieStore.put('password', $scope.password);
				$cookieStore.put('userRole', user.role);
				$location.path('/home');				
			}
		}
	},
    //error
    function () {
      $scope.errorMessage = cfg.errorConnect;
      $scope.isError = true;

    }
  );
  };


  $scope.releaseError = function() {
    $scope.isError = false;

  }
});