'use strict';

angular.module('websoApp')
    .config(function($httpProvider) { $httpProvider.defaults.useXDomain = true; delete $httpProvider.defaults.headers.common['X-Requested-With'];})
    .controller('ProfileSettingCtrl', function ($scope, $resource, $cookieStore, $location, cfg, $filter, $window) {

    $scope.isSuccess = false;
    var username = $cookieStore.get('username');
    var lang     = $cookieStore.get('lang');
    var token    = $cookieStore.get('token');
    var tokenTimeout    = $cookieStore.get('token_timeout');
    var userId = '';
    $scope.username = username;

    //Definition to avoid undefined error
    $scope.password        = '';
    $scope.passwordConfirm = '';
    $scope.email           = '';
    $scope.langs           = $filter('i18n')('_LANG_LIST_');
    var tmp = [];

    angular.forEach($scope.langs, function(val, key){
        tmp[val.id] = val;
    });
    $scope.lang = tmp[lang];

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
        {action:'change.pl', callback:"JSON_CALLBACK"},
        {put:{method:'JSONP'},
        post:{method:'POST', headers: {'Content-Type': 'application/json'}}});

    $scope.modifyPassword = function() {
        if($scope.password.length == 0 && $scope.passwordConfirm.length == 0){
            $scope.errorMessagePassword = $filter('i18n')('_EMPTY_PASSWORD_');
            $scope.isErrorPassword = true;
        }else if($scope.password.length < 6 || $scope.password.length > 20){
            $scope.errorMessagePassword = $filter('i18n')('_PASSWORD_LENGTH_');
            $scope.isErrorPassword = true;
        }else if($scope.password !== $scope.passwordConfirm){
            $scope.errorMessagePassword = $filter('i18n')('_DIFF_PASSWORD_');
            $scope.isErrorPassword = true;
        }
        else{
            $scope.informationModify.post({id: userId, password_s: $scope.password}).$promise.then(function(user) {
                if(user.error){
                    $scope.isErrorPassword = true;
                    $scope.errorMessagePassword = user.error;
                }
                else {
                    if(user.success){
                        $scope.isSuccessPassword = true;
                        $scope.messagePassword = $filter('i18n')('_UPDATE_INFO_OK_');
                    }
                }
            },
              //error
              function(user) {
                if(user){
                    $scope.errorMessagePassword = user;
                }
                else{
                    $scope.errorMessagePassword = $filter('i18n')('_ERROR_CONNECTION_');
                }
                $scope.isErrorPassword = true;

              }
            );
        }
    };

    $scope.modifyEmail = function() {
        if($scope.email.length == 0){
            $scope.errorMessageMail = $filter('i18n')('_EMPTY_MAIL_');
            $scope.isErrorMail = true;
        }   
        else{
            $scope.informationModify.post({id: userId, email_s: $scope.email}).$promise.then(function(user) {
                if(user.error){
                    $scope.isErrorMail = true;
                    $scope.errorMessageMail = user.error;
                }
                else {
                    if(user.success){   
                        $scope.isSuccessMail = true;
                        $scope.messageMail = $filter('i18n')('_UPDATE_INFO_OK_');
                    }
                }
            },
              //error
              function () {
                $scope.errorMessageMail = $filter('i18n')('_ERROR_CONNECTION_');
                $scope.isErrorMail = true;
              }
            );
        }
    };

    $scope.modifyLang = function() {
        if(angular.isUndefined($scope.lang) || $scope.lang.length == 0){
            $scope.errorMessageLang = $filter('i18n')('_EMPTY_LANG_');
            $scope.isErrorLang = true;
        }   
        else{
            $scope.informationModify.post({id: userId, lang_s: $scope.lang.id}).$promise.then(function(user) {
                if(user.error){
                    $scope.isErrorLang = true;
                    $scope.errorMessageLang = user.error;
                }
                else {
                    if(user.success){   
                        $scope.isSuccessLang = true;
                        $scope.messageLang = $filter('i18n')('_UPDATE_INFO_OK_');
                        $cookieStore.put('lang', $scope.lang.id);
                        $window.location.reload();
                    }
                }
            },
              //error
              function () {
                $scope.errorMessageLang = $filter('i18n')('_ERROR_CONNECTION_');
                $scope.isErrorLang = true;
              }
            );
        }
    };

    $scope.releaseError = function() {
        $scope.isErrorMail = false;
        $scope.isErrorLang = false;
        $scope.isErrorPassword = false;
    }
});