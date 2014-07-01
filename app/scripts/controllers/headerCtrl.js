 'use strict';
angular.module('websoApp')
	.controller('headerCtrl',function($scope, serviceRestrictions, $cookieStore, $location, $resource, cfg){

	var $user = $cookieStore.get('username');
	var $role = $cookieStore.get('userRole');

	$scope.isPublic = true;
	$scope.isLecteurVeilleurAdmin = false;
	$scope.isPublicNotAuthenticated = true;

	$scope.templates = [{
	    name: 'head.html',
	    url: 'views/head.html'}];

	var restrictions = serviceRestrictions.getRestrictions();

	$scope.isLecteurVeilleurAdmin = restrictions[0];
	$scope.isVeilleurAdmin = restrictions[1];
	$scope.isAdmin = restrictions[2];
	$scope.isPublicNotAuthenticated = restrictions[3];

	$scope.template = $scope.templates[0];

	if(!$scope.isPublicNotAuthenticated){
		$scope.username = $user; 
		$scope.userRole = $role; 
	}

/****************** Disconnection procedure *******************/  
  $scope.verifyLogout = $resource(cfg.urlServices+'db/:action',
      {action:'logout.pl', callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

  $scope.logout = function () {
  	$scope.loading = true;
    // sending login information to service to validate the disconnection
	var $user = $cookieStore.get('username');
	var $pass = $cookieStore.get('password');
	$scope.verifyLogout.get({user_s : $user, password_s : $pass}).$promise.then(function(user) {
		if(user.error){
			$scope.loading = false;
			$scope.message = user.error;
			$location.path('/login');
		}
		else {
			if(user.success){
				$scope.loading = false;
				$cookieStore.put('Authenticated', false);
				$scope.isAuthenticated = false;
				$cookieStore.remove('username');
				$cookieStore.remove('password');
				$cookieStore.remove('userRole');
				$cookieStore.remove('Authenticated');
				$scope.message = '';
				$location.path('/home');
			}
		}
	});
  };	
 });
