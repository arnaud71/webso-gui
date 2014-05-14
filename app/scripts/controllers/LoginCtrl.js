'use strict';

angular.module('websoApp')
	.controller('LoginCtrl', function ($cookieStore, $scope, $resource, $location, cfg) {

/****************** procedure d'initialisation *******************/
	$scope.isError = false;
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
    // envoi d'informations de login au service pour valider l'authentification  
	$scope.verifyLogin.get({user_s : $scope.username, password_s : $scope.password}).$promise.then(function(user) {
				
		if(user.error){
			$scope.isError = true;
			$scope.errorMessage = user.error;
		}
		else {
			if(user.success){
				$cookieStore.put('Authenticated', true);
				$scope.isAuthenticated = true;
				$cookieStore.put('username', $scope.username);
				$cookieStore.put('password', $scope.password);
				$cookieStore.put('userRole', user.role);
				$location.path('/home');				
			}
		}
	});
  };
});