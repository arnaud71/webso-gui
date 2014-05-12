'use strict';

angular.module('websoApp')
    .controller('userRegisterCtrl', function ($scope, $resource, cfg) {

    $scope.isSuccess = false;

    $scope.informationAdd = $resource(cfg.urlServices+':action',
        {action:'put.pl', type_s:'enregistrement', jeton_s : false, 
        //compteur_sessions_s : 0
        callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

    $scope.register = function() {
        $scope.informationAddResult = $scope.informationAdd.get({
            user_s  : $scope.username,
            password_s : $scope.password,
            role_s : 'veilleur'
        });

        $scope.isSuccess = true;
		$scope.message = "Le compte a été enregistré avec succès";
        $scope.username = "";
        $scope.password = "";
    };
});
