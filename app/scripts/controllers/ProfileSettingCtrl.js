'use strict';

angular.module('websoApp')
    .controller('ProfileSettingCtrl', function ($scope, $resource, $cookieStore, $location, cfg) {

    $scope.isSuccess = false;
    var username = $cookieStore.get('username');
    var token    = $cookieStore.get('token');
    var tokenTimeout    = $cookieStore.get('token_timeout');
    var userId = "";
    $scope.username = username;

    //Definition to avoid undefined error
    $scope.password        = '';
    $scope.passwordConfirm = '';
    $scope.email           = '';

    $scope.userList = $resource(cfg.urlServices+'db/:action',
        {action:'get.pl', token_s: token, token_timeout_l: tokenTimeout, callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

    $scope.userList.get({
        type_s: 'user'
      }).$promise.then(function (result) {
        //Select user ID to make atomic changes 
        userId = result.success.response.docs[0].id;
        $scope.email = result.success.response.docs[0].email_s
      });

    $scope.informationModify = $resource(cfg.urlServices+'db/:action',
        {action:'change.pl', id: userId, callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});
        //{post:{method:'POST'}});

    $scope.modifyPassword = function() {
        if($scope.password.length == 0 && $scope.passwordConfirm.length == 0){
            $scope.errorMessagePassword = 'Mots de passe vide.';
            $scope.isErrorPassword = true;
        }else if($scope.password.length < 6 || $scope.password.length > 20){
            $scope.errorMessagePassword = 'Longueur du mot de passe doit être superieur à 6 et inférieur à 20 caractères';
            $scope.isErrorPassword = true;
        }else if($scope.password !== $scope.passwordConfirm){
            $scope.errorMessagePassword = 'Les mots de passe ne correspondent pas.';
            $scope.isErrorPassword = true;
        }
        else{
            $scope.informationModify.get({id: userId, password_s: $scope.password}).$promise.then(function(user) {
            // $scope.informationModify.post({password_s: $scope.password, email_s: $scope.email}).$promise.then(function(user) {
                if(user.error){
                    $scope.isErrorPassword = true;
                    $scope.errorMessagePassword = user.error;
                }
                else {
                    if(user.success){
                        $scope.isSuccessPassword = true;
                        $scope.messagePassword = 'Vos informations on été mises à jour avec succès.';
                    }
                }
            },
              //error
              function () {
                $scope.errorMessagePassword = cfg.errorConnect;
                $scope.isErrorPassword = true;

              }
            );
        }
    };

    $scope.modifyEmail = function() {
        if($scope.email.length == 0){
            $scope.errorMessageMail = 'Email vide.';
            $scope.isErrorMail = true;
        }   
        else{
            $scope.informationModify.get({id: userId, email_s: $scope.email}).$promise.then(function(user) {
            // $scope.informationModify.post({password_s: $scope.password, email_s: $scope.email}).$promise.then(function(user) {
                if(user.error){
                    $scope.isErrorMail = true;
                    $scope.errorMessageMail = user.error;
                }
                else {
                    if(user.success){   
                        $scope.isSuccessMail = true;
                        $scope.messageMail = 'Vos informations on été mises à jour avec succès.';
                    }
                }
            },
              //error
              function () {
                $scope.errorMessageMail = cfg.errorConnect;
                $scope.isErrorMail = true;
              }
            );
        }
    };

    $scope.releaseError = function() {
        $scope.isErrorMail = false;
        $scope.isErrorPassword = false;
    }
});