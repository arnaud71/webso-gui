'use strict';

angular.module('websoApp')
    .controller('administratorRegisterCtrl', function ($scope, $resource, cfg) {

    $scope.isSuccess = false;
    /*
     Roles menu
     */
    $scope.roles =  ['administrateur', 'veilleur', 'lecteur'];
    $scope.userRole = $scope.roles[2];

    $scope.informationAdd = $resource(cfg.urlServices+'db/:action',
        {action:'register.pl', callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

    $scope.register = function() {
        $scope.informationAddResult = $scope.informationAdd.get({
            user_s  : $scope.username,
            password_s : $scope.password,
            role_s : $scope.userRole
        }).$promise.then(function(user) {
                if(user.error){
                    $scope.isError = true;
                    $scope.errorMessage = user.error;
                }
                else {
                    if(user.success){
                        $scope.isSuccess = true;
                        $scope.message = "Le compte a été enregistré avec succès";
                        $scope.username = "";
                        $scope.password = "";                    
                    }
                }
        });
    };
    
    $scope.releaseError = function() {
        $scope.isError = false;
    }    
});
