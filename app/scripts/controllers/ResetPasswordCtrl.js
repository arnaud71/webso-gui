'use strict';

angular.module('websoApp')
    .controller('ResetPasswordCtrl', function ($cookieStore, $scope, $resource, $location, localStorageService, cfg, $http, $filter) {

    /****************** Reset procedure ***********************/  
    $scope.resetPassword = $resource(cfg.urlServices+'db/:action',
        {action:'reset.pl'},
        {   get:{method: 'JSONP'},
            post:{method:'POST', headers:'Content-Type:application/x-www-form-urlencoded'}
        });

    $scope.send = function () {
        // Prepare info to be send
        var requete = {user_s : $scope.username, email_s : $scope.email, callback:"JSON_CALLBACK"};
        // Send POST request to the service
        $scope.resetPassword.get(requete).$promise.then(function(user) {
            // Return status and message
            if(user.error){
                $scope.isError = true;
                $scope.errorMessage = user.error;
            }
            else {
                if(user.success){
                    $scope.isSuccess = true;
                    $scope.successMessage = $filter('i18n')('_RESETPWD_OK_MSG_');
                }
            }
        },
        // Error sending request
        function () {
          $scope.errorMessage = $filter('i18n')('_ERROR_CONNECTION_');
          $scope.isError = true;
        }
        );
    };

    $scope.sendX = function () {
        var config = {
            headers: { 
                'Cache-Control': 'no-cache',
                'Content-Type': 'multipart/form-data'
            }
        };
        $http.post(cfg.urlServices+"db/reset.pl", {
          user_s: $scope.username, 
          email_s: $scope.email
        }, config).success(function(data, status, headers, config) {
           alert("Success"+status);
        }).error(function(data, status) {
            // var err = new Error('Error message');
            // err.status = status;
            // callback(err);
            $scope.isError = true;
            $scope.errorMessage = status+data+"Failed";
        });
        // // Prepare info to be send
        // var requete = {user_s : $scope.username, email_s : $scope.email, callback:"JSON_CALLBACK"};
        // // Send POST request to the service
        // $scope.resetPassword.post(requete).$promise.then(function(user) {
        //     // Return status and message
        //     if(user.error){
        //         $scope.isError = true;
        //         $scope.errorMessage = user.error;
        //     }
        //     else {
        //         if(user.success){
        //             $scope.isSuccess = true;
        //             $scope.successMessage = $SUCCESS_TXT;
        //         }
        //     }
        // },
        // // Error sending request
        // function () {
        //   $scope.errorMessage = cfg.errorConnect;
        //   $scope.isError = true;
        // }
        // );
    };

    $scope.releaseError = function() {
        $scope.isError = false;
    }
});