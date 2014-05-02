'use strict';

angular.module('websoApp')
	.controller('LoginCtrl', function ($cookieStore, $location, $scope, $resource, cfg) {

/****************** procedure d'initialisation *******************/
	$scope.isError = false;
	$scope.isAuthenticated = $cookieStore.get('Authenticated');

	if ($scope.isAuthenticated) {
		$scope.username = $cookieStore.get('username');
		$scope.password = $cookieStore.get('password');
		$scope.message = 'Bienvenue ' + $scope.username + ' !';
	}
	else {
		$scope.message = '';
	}

/****************** procedure de connexion ***********************/  
  $scope.verifyLogin = $resource(cfg.urlServices+':action',
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
				$scope.message = 'Bienvenue ' + $scope.username + ' !';
			}
		}
	});
  };

/****************** procedure de deconnexion *******************/  
  $scope.verifyLogout = $resource(cfg.urlServices+':action',
      {action:'logout.pl', callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

  $scope.logout = function () {
    // envoi d'informations de login au service pour valider la deconnexion
	
	var $user = $cookieStore.get('username');
	var $pass = $cookieStore.get('password');
	$scope.verifyLogout.get({user_s : $user, password_s : $pass}).$promise.then(function(user) {
		if(user.error){
			$scope.message = user.error;
			$location.path('/login');
		}
		else {
			if(user.success){
				$cookieStore.put('Authenticated', false);
				$scope.isAuthenticated = false;
				$cookieStore.remove('username');
				$cookieStore.remove('password');
				$cookieStore.remove('userRole');
				$scope.message = '';
				$location.path('/login');
			}
		}
	});
  };
});