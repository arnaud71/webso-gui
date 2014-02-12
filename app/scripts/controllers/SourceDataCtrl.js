'use strict';

angular.module('websoApp')
  .controller('SourceDataCtrl', function ($scope,$resource,cfg) {

    /*
     $scope.sourceData = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
     {action:'get.json', source_user:'user_1',callback:"JSON_CALLBACK"},
     {get:{method:'JSONP'}});
     */
    $scope.sourceData = $resource(cfg.urlServices+':action',
      {action:'get.pl', type_s:'source',user_s:'user_0',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.doSearch = function () {
      $scope.sourceResult = $scope.sourceData.get();
    };

    $scope.doSearch();

  });

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1