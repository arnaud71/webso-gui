 'use strict';
angular.module('websoApp')
	.controller('headerCtrl',function($scope, serviceRestrictions, $cookieStore, $location, $resource, cfg){

	var $token = $cookieStore.get('token');
	var $token_timeout = $cookieStore.get('token_timeout');

	$scope.dbRights = $resource(cfg.urlServices+'db/:action',
	  {action:'get.pl',token_s:$token,token_timeout_l:$token_timeout,callback:'JSON_CALLBACK'},
	  {get:{method:'JSONP'}});

	$scope.dbRights.get({token_s:$token}).$promise.then(function(right) {
		if(right.error){
			$scope.loading = false;
			$scope.message = right.error;
		}
		else {
			if(right.success){
				if(!$scope.isPublicNotAuthenticated){
					$scope.username = right.success.response.docs[0].user_s;
					$scope.userRole = right.success.response.docs[0].role_s;
				}
			}
		}
	});

	$scope.isPublic = true;
	$scope.isLecteurVeilleurAdmin = false;
	$scope.isPublicNotAuthenticated = true;
	$scope.hideForTests = cfg.hideForTest;
	$scope.heg = cfg.heg;

	$scope.templates = [{
		name: 'head.html',
		url: 'views/head.html'}];

	var restrictions = serviceRestrictions.getRestrictions();

	$scope.isLecteurVeilleurAdmin = restrictions[0];
	$scope.isVeilleurAdmin = restrictions[1];
	$scope.isAdmin = restrictions[2];
	$scope.isPublicNotAuthenticated = restrictions[3];

	$scope.template = $scope.templates[0];

	/****************** Disconnection procedure *******************/  
	$scope.verifyLogout = $resource(cfg.urlServices+'db/:action',
		  {action:'logout.pl', callback:"JSON_CALLBACK"},
		  {get:{method:'JSONP'}});

	$scope.logout = function () {
		$scope.loading = true;
		// sending login information to service to validate the disconnection
		$scope.verifyLogout.get({token_s : $token, token_timeout_l : $token_timeout}).$promise.then(function(user) {
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
					$cookieStore.remove('Authenticated');
					$cookieStore.remove('username');
					$cookieStore.remove('userRole');
					$cookieStore.remove('token');
					$cookieStore.remove('token_timeout');
					$scope.message = '';
					$location.path('/home');
				}
			}
		});
	};	
});
