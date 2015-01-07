'use strict';

angular.module('websoApp')
    .controller('publicRegisterCtrl', function ($scope, $resource, $cookieStore, $location, cfg, $filter) {

    $scope.isSuccess = false;

    $scope.informationAdd = $resource(cfg.urlServices+'db/:action',
        {action:'register.pl', callback:'JSON_CALLBACK'},
        {get:{method:'JSONP'}});

    $scope.verifyLogin = $resource(cfg.urlServices+'db/:action',
        {action:'login.pl', callback:'JSON_CALLBACK'},
        {get:{method:'JSONP'}});

    $scope.addResource = $resource(cfg.urlServices+'db/:action',
        {action:'put.pl', callback:'JSON_CALLBACK'},
        {get:{method:'JSONP'}});

    var folder = {
      edit : false,
      data : [{
        'id': 1,
        'title': 'Racine',
        'nodes': [
          {
            'id': 11,
            'title': 'dossier.1',
            'nodes': [
              {
                'id': 111,
                'title': 'dossier.1.1',
                'nodes': []
              }
            ]
          },
          {
            'id': 12,
            'title': 'dossier.2',
            'nodes': []
          }
        ],
      }]
    };
    $scope.langs = $filter('i18n')('_LANG_LIST_');


    var login = function (username, password) {
        // sending login information to the service to validate the authentication
        $scope.verifyLogin.get({user_s : username, password_s : password}).$promise.then(function(user) {
            $cookieStore.put('Authenticated', true);
            $cookieStore.put('username', user.username);
            $cookieStore.put('userRole', user.role);
            $cookieStore.put('token', user.token);
            $cookieStore.put('token_timeout', user.token_timeout);
            $cookieStore.put('lang', user.lang);
            $location.path('/home');
        });
    };

    $scope.register = function() {
        $scope.informationAdd.get({user_s  : $scope.username, password_s : $scope.password, email_s : $scope.email, role_s : 'veilleur', lang_s: $scope.lang.id}).$promise.then(function(user) {
            if(user.error){
                $scope.isError = true;
                $scope.errorMessage = user.error;
            }
            else {
                $scope.sourceSaveTree = $scope.addResource.get({
                    user_s          : $scope.username,
                    type_s          : 'tree',
                    title_t         : 'vfolder',
                    content_s       : $filter('json')(folder.data)
                });
                $scope.sourceSaveTree = $scope.addResource.get({
                    user_s          : $scope.username,
                    type_s          : 'tree',
                    title_t         : 'wfolder',
                    content_s       : $filter('json')(folder.data)
                });
                if(user.success){
                    $scope.isSuccess = true;
                    $scope.message = 'Le compte a été enregistré avec succès -> Connexion ...';
                    login($scope.username, $scope.password);
                }
            }
        },
          //error
          function () {
            $scope.errorMessage = cfg.errorConnect;
            $scope.isError = true;

          }
        );
    };

    $scope.releaseError = function() {
        $scope.isError = false;
    }
});