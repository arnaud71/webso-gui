'use strict';

angular.module('websoApp')
    .controller('publicRegisterCtrl', function ($scope, $resource, $cookieStore, $location, cfg) {

    $scope.isSuccess = false;

    $scope.informationAdd = $resource(cfg.urlServices+'db/:action',
        {action:'register.pl', callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

    $scope.verifyLogin = $resource(cfg.urlServices+'db/:action',
        {action:'login.pl', callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

    var login = function (username, password) {
        // sending login information to the service to validate the authentication
        $scope.verifyLogin.get({user_s : username, password_s : password}).$promise.then(function(user) {
            $cookieStore.put('Authenticated', true);
            $cookieStore.put('username', $scope.username);
            $cookieStore.put('password', $scope.password);
            $cookieStore.put('userRole', user.role);
            $location.path('/home');
        });
    };

    $scope.register = function() {
        $scope.informationAdd.get({user_s  : $scope.username, password_s : $scope.password, role_s : 'veilleur'}).$promise.then(function(user) {
            if(user.error){
                $scope.isError = true;
                $scope.errorMessage = user.error;
            }
            else {
                if(user.success){
                    $scope.isSuccess = true;
                    $scope.message = "Le compte a été enregistré avec succès -> Connexion ...";
                    login($scope.username, $scope.password);
                }
            }
        });
    };

    $scope.releaseError = function() {
        $scope.isError = false;
    }
});