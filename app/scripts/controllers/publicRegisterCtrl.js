'use strict';

angular.module('websoApp')
    .controller('publicRegisterCtrl', function ($scope, $cookieStore, $location, $resource, cfg) {

    $scope.isSuccess = false;

    $scope.informationAdd = $resource(cfg.urlServices+'db/:action',
        {action:'put.pl', type_s:'user', jeton_s : false,
        //compteur_sessions_s : 0
        callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

  	$scope.verifyLogin = $resource(cfg.urlServices+'db/:action',
    	{action:'login.pl', callback:"JSON_CALLBACK"},
      	{get:{method:'JSONP'}});

    $scope.register = function() {
	    // envoi d'informations de login au service pour valider l'authentification  
		$scope.verifyLogin.get({user_s : $scope.username, password_s : $scope.password}).$promise.then(function(user) {
			if(user.error){
		        $scope.informationAdd.get({
		            user_s  : $scope.username,
		            password_s : $scope.password,
		            role_s : 'veilleur'
		        });
		        $scope.isSuccess = true;
		        $scope.register();
				$scope.message = "Connexion ...";
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