'use strict';

angular.module('websoApp')
    .controller('ValidationDataCtrl', function ($scope,$resource,cfg) {

        /*
         $scope.sourceData = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
         {action:'get.json', source_user:'user_1',callback:"JSON_CALLBACK"},
         {get:{method:'JSONP'}});
         */
        $scope.validationData = $resource(cfg.urlServices+':action',
            {action:'get.pl', type_s:'validation',user_s:'user_0',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

        $scope.doSearch = function () {
            $scope.validationResult = $scope.validationData.get();
        };

        $scope.doSearch();


    });

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1