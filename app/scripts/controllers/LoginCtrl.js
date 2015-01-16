'use strict';

angular.module('websoApp')
    .controller('LoginCtrl', function ($cookieStore, $scope, $resource, $location, localStorageService, cfg) {

/****************** initialization procedure *******************/
    var usernameStorage = localStorageService.get('username');
    var passwordStorage = localStorageService.get('password');

    if(usernameStorage && passwordStorage){
        $scope.username = usernameStorage;
        $scope.password = passwordStorage;
    }

    $scope.isError = false;
    $scope.valueCheckBox = false;
    $scope.isAuthenticated = $cookieStore.get('Authenticated');

    /*if ($scope.isAuthenticated) {
        $scope.username = $cookieStore.get('username');
        $scope.password = $cookieStore.get('password');
    }*/

    if ($scope.isAuthenticated) {
        var token         = $cookieStore.get('token');
        var token_timeout = $cookieStore.get('token_timeout');
    }

/****************** Connection procedure ***********************/
    $scope.verifyLogin = $resource(cfg.urlServices+'db/:action',
        {action:'login.pl', callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'},
        post:{method:'POST', headers: {'Content-Type': 'application/json'}}});

    $scope.ressource = $resource(cfg.urlServices+'db/:action',
        {action:'get.pl',callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

    $scope.login = function () {
        $scope.loading = true;
        // sending login information to the service to validate the authentication
        var requete = {};
        // if(scope.isAuthenticated){
        //  requete = {token_s : token, token_timeout_dt : token_timeout};
        // }
        // else{
            requete = {user_s : $scope.username, password_s : $scope.password};
        //}
        $scope.verifyLogin.post(requete).$promise.then(function(user) {

            if(user.error){
                $scope.loading = false;
                $scope.isError = true;
                $scope.errorMessage = user.error;
            }
            else {
                if(user.success){
                    // Queries to simplify some view in search
                    $scope.ressource.get({
                        type_s      : 'tree',
                        title_t     : 'vfolder',
                        user_s      : $scope.username,
                    }).$promise.then(function(result) {

                        var $vfolder = [];
                        var tmp = JSON.parse(result.success.response.docs[0].content_s);
                        var log = [];
                        angular.forEach(tmp[0].nodes, function(value1, key1) {
                            // if(angular.isArray(value1)){

                            $vfolder.push({"id":value1.id ,"name":value1.title});
                            angular.forEach(value1.nodes, function(value2, key2){
                                $vfolder.push({"id":value2.id , "name":value2.title});
                                angular.forEach(value2.nodes, function(value3, key3){
                                    $vfolder.push({"id":value3.id, "name":value3.title});
                                    if(angular.isArray(value3.nodes)){
                                        angular.forEach(value3.nodes, function(value4, key4){
                                            $vfolder.push({"id":value4.id, "name":value4.title});
                                        }, log);
                                    }
                                }, log);
                            }, log);
                        }, log);
                        $cookieStore.put('vfolder', $vfolder);
                        // alert($vfolder);

                    }, function(reason) {
                        alert('Failed: ' + reason);
                    });

                    $scope.ressource.get({
                        type_s      : 'tree',
                        title_t     : 'wfolder',
                        user_s      : $scope.username,
                    }).$promise.then(function(result) {

                        var $wfolder = [];
                        var tmp = JSON.parse(result.success.response.docs[0].content_s);
                        var log = [];
                        angular.forEach(tmp[0].nodes, function(value1, key1) {
                            // if(angular.isArray(value1)){

                            $wfolder.push({"id":value1.id ,"name":value1.title});
                            angular.forEach(value1.nodes, function(value2, key2){
                                $wfolder.push({"id":value2.id , "name":value2.title});
                                angular.forEach(value2.nodes, function(value3, key3){
                                    $wfolder.push({"id":value3.id, "name":value3.title});
                                    if(angular.isArray(value3.nodes)){
                                        angular.forEach(value3.nodes, function(value4, key4){
                                            $wfolder.push({"id":value4.id, "name":value4.title});
                                        }, log);
                                    }
                                }, log);
                            }, log);
                        }, log);
                        $cookieStore.put('wfolder', $wfolder);

                    }, function(reason) {
                        alert('Failed: ' + reason);
                    });

                    $scope.loading = false;
                    if($scope.valueCheckBox === true){
                        localStorageService.set('username', $scope.username);
                        localStorageService.set('token', user.token);
                        localStorageService.set('token_timeout', user.token_timeout);
                    }
                    $cookieStore.put('Authenticated', true);
                    $scope.isAuthenticated = true;
                    $cookieStore.put('username', user.username);
                    $cookieStore.put('userRole', user.role);
                    $cookieStore.put('lang', user.lang);
                    $cookieStore.put('token', user.token);
                    $cookieStore.put('token_timeout', user.token_timeout);
                    
                    $location.path('/home');
                }
            }
        },
        //error
        function () {
          $scope.errorMessage = cfg.errorConnect;
          $scope.isError = true;

        });
    };


  $scope.releaseError = function() {
    $scope.isError = false;

  }
});