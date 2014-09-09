/* *
 * The MIT License
 * 
 * Copyright (c) 2013, Sebastian Sdorra
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

angular.module('sample.widgets.affichageCollectesMultisources', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('affichageCollectesMultisources', {
        title: 'Collectes multisources',
        description: 'Collectes multisources',
        controller: 'collectesMultisourcesCtrl',
        templateUrl: 'scripts/controllers/widgets/affichageCollectesMultisources/affichageCollectesMultisources.html',
        reload: true,
        resolve: {
          data: function(config){
            if (config.content){
              return config.content;
            }
          },
          title: function(config){
            if (config.title){
              return config.title;
            }
          }



        },

        edit: {
          templateUrl: 'scripts/controllers/widgets/affichageCollectesMultisources/edit.html',
          controller: 'collectesMultisourcesEditCtrl'

        }
      });
  }).controller('collectesMultisourcesCtrl', function($scope, data, $resource, cfg) {

    if ($scope.config.content) {

      //$scope.query = $scope.data.query;
      //$scope.typeQuery = $scope.data.param.value;


    $scope.querySearch = $resource(cfg.urlServices + 'harvester/QUERYSEARCH/:action',
      {action: 'get_querysearch.pl', query: '', typeQuery: '', callback: "JSON_CALLBACK"},
      {get: {method: 'JSONP'}});

    $scope.querySearchResult = $scope.querySearch.get({query: $scope.config.content, typeQuery: 'google_news'});
  }



  }).controller('collectesMultisourcesEditCtrl', function($rootScope, $cookieStore, $location, $scope, $resource, cfg, $modal){

    //$scope.data = angular.fromJson(data);

    //$scope.querySaved   = $scope.data.query;
    //$scope.paramSaved   = $scope.data.param;

    $scope.queryTypes = cfg.querySearchTypeList;

    $scope.query = {};

    //$scope.query.selected = $scope.config.param // set the initial selected option


    $scope.$watch('query.selected', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.config.param = $scope.query.selected;
      }
    }, true);


  });
