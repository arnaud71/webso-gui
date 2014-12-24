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

angular.module('sample.widgets.affichageDossiersValidation', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('affichageDossiersValidation', {
        title: 'Dossiers de validation',
        description: 'Dossiers de validation',
        controller: 'dossiersValidationCtrl',
        templateUrl: 'scripts/controllers/widgets/affichageDossiersValidation/affichageDossiersValidation.html',
        reload: true,
        resolve: {
          data: function(config){
            if (config.content){
              return config.content;
            }
          }
        },
        edit: {
          templateUrl: 'scripts/controllers/widgets/affichageDossiersValidation/edit.html',
          controller: 'dossiersValidationEditCtrl'
        }
      });
  }).controller('dossiersValidationCtrl', function($scope, $resource, cfg, serviceWidgets, data){

    var currentUsername = serviceWidgets.getUserIdents();

    // $scope.solr = $resource(cfg.urlDB+'solr/collection1/:action',
    //   {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
    //   {get:{method:'JSONP'}});
    $scope.solr = $resource(cfg.urlServices+'db/:action',
      {action:'query.pl', qt:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

    // $scope.solrResult       = $scope.solr.get({sort:'updating_dt desc', rows:5, q:'user_s:' + currentUsername[0],fq:'type_s:validation'});
    if(angular.isDefined(data)){
      $scope.solrResult = $scope.solr.get({sort:'updating_dt desc', rows:5, q:'user_s:' + currentUsername[0],fq:'type_s:validation AND folder_i:'+angular.fromJson(data).id});
    }
    else{
      $scope.solrResult = $scope.solr.get({sort:'updating_dt desc', rows:5, q:'user_s:' + currentUsername[0],fq:'type_s:validation'});
    }

  }).controller('dossiersValidationEditCtrl', function($scope, $resource, $cookieStore, cfg){

    var usernameCookie = $cookieStore.get('username');
    var token = $cookieStore.get('token');
    var token_timeout = $cookieStore.get('token_timeout');

    $scope.dbList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',user_s:usernameCookie,callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    // ***************************************************************
    // doSearchFolder
    // list the available sources
    $scope.folders = [];
    $scope.doSearchFolder = function () {
      $scope.isError = false;

      $scope.dbList.get({
        type_s      : 'tree',
        title_t     : 'vfolder',
        user_s      : usernameCookie,
      }).$promise.then(function(result) {

          $scope.folders = [];
          var tmp = JSON.parse(result.success.response.docs[0].content_s);
          var log = [];
          angular.forEach(tmp[0].nodes, function(value1, key1) {
            // if(angular.isArray(value1)){

            $scope.folders.push({"id":value1.id ,"name":value1.title});
            angular.forEach(value1.nodes, function(value2, key2){
              $scope.folders.push({"id":value2.id , "name":value2.title});
              angular.forEach(value2.nodes, function(value3, key3){
                $scope.folders.push({"id":value3.id, "name":value3.title});
                if(angular.isArray(value3.nodes)){
                  angular.forEach(value3.nodes, function(value4, key4){
                    $scope.folders.push({"id":value4.id, "name":value4.title});
                  }, log);
                }
              }, log);
            }, log);
          }, log);
          //$scope.folders = JSON.parse(result.success.response.docs[0].content_s);
          //$scope.folder = $scope.folders[1];

        }, function(reason) {
          alert('Failed: ' + reason);
        });
    };
    $scope.doSearchFolder();
  });