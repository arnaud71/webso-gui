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

angular.module('sample.widgets.affichageCollectesEnAttente', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('affichageCollectesMultisources', {
        title: 'Recherche en attente',
        description: 'Recherche en attente',
        controller: 'collectesMultisourcesCtrl',
        templateUrl: 'scripts/controllers/widgets/affichageCollectesEnAttente/affichageCollectesEnAttente.html',
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
          templateUrl: 'scripts/controllers/widgets/affichageCollectesEnAttente/edit.html',
          controller: 'collectesMultisourcesEditCtrl'
        }
      });

  }).controller('collectesMultisourcesCtrl', function($scope, data, $resource, cfg) {
    if (data) {
      //alert($scope.config.content);

      //$scope.query = $scope.data.query;
      //$scope.typeQuery = $scope.data.param.value;
      $scope.querySearch = $resource(cfg.urlServices + 'harvester/QUERYSEARCH/:action',
        {action: 'get_querysearch.pl', query: '', typeQuery: '', callback: "JSON_CALLBACK"},
        {get: {method: 'JSONP'}});

      $scope.solr = $resource(cfg.urlServices+'db/:action',
        {action:'query.pl', qt:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
        {get:{method:'JSONP'}});
    
      // $scope.Result = $scope.solr.get({sort:'updating_dt desc', rows:5, fq:'type_s:watch AND id:'+id_source});
      $scope.solrResult = $scope.solr.get({sort:'updating_dt desc', rows:5, fq:'type_s:document AND source_id_ss:'+data});
      /*$scope.solr.get({sort:'updating_dt desc', rows:5, fq:'type_s:source AND id:'+data})
          .$promise.then(function(result){
              if(result.success.response.numFound){
                  // Result = result.success.response.docs[0].source_id_s;
                  var OnlineData = result.success.response.docs[0];
                  // $scope.querySearchResult = $scope.querySearch.get({query: result.success.response.docs[0].query_s, typeQuery: result.success.response.docs[0].ressources_s});
                  // $scope.solr.get({sort:'date_dt desc', rows:5, q:result.success.response.docs[0].query_s, fq:'type_s:document AND source_id_ss:'+result.success.response.docs[0].source_id_s})
                  //     .$promise.then(function(data){
                  //         $scope.solrResult = data;
                  //     });
              }
          });*/
    // $scope.querySearchResult = $scope.querySearch.get({query: $scope.config.content, typeQuery: 'google_news'});
  }



  // }).controller('collectesMultisourcesEditCtrl', function($rootScope, $cookieStore, $location, $scope, $resource, cfg, $modal){

  //   //$scope.data = angular.fromJson(data);

  //   //$scope.querySaved   = $scope.data.query;
  //   //$scope.paramSaved   = $scope.data.param;

  //   $scope.queryTypes = cfg.querySearchTypeList;

  //   $scope.query = {};

  //   //$scope.query.selected = $scope.config.param // set the initial selected option


  //   $scope.$watch('query.selected', function (newVal, oldVal) {
  //     if (newVal !== oldVal) {
  //       $scope.config.param = $scope.query.selected;
  //     }
  //   }, true);


  // });
  }).controller('collectesMultisourcesEditCtrl', function($rootScope, $cookieStore, $location, $scope, $resource, cfg, $modal, $filter){

    $scope.mySelections = [];
    var usernameCookie = $cookieStore.get('username');
    var token = $cookieStore.get('token');
    var token_timeout = $cookieStore.get('token_timeout');

    // $ressource(cfg.urlServices+'db/:action',
    //   {action:'get.pl', type_s:'user', token_s:token, token_timeout_s:token_timeout, callback:"JSON_CALLBACK"},
    //   {get:{method:'JSONP'}}).success()
    // ;

    $scope.sourcesList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl', type_s:'source', waiting_b: true, user_s: usernameCookie, callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});
    $scope.solr = $resource(cfg.urlServices+'db/:action',
      {action:'query.pl', qt:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

    $scope.filterOptions = {
      filterText: "",
      useExternalFilter: false
    };

    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
      pageSizes: [10,100,1000],
      pageSize: 10,
      currentPage: 1
    };

    $scope.setPagingData = function(data, page, pageSize){
      $scope.totalServerItems = data.success.response.numFound;
      data = data.success.response.docs;
      $scope.myData = data;
      if($rootScope.$$phase !== '$digest'){
        $rootScope.$digest(); 
      }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
      // setTimeout(function () {
      var data;
      $scope.sourceResult = $scope.sourcesList.get({rows:pageSize,start:(page*pageSize-pageSize)},
        function() {        //call back function for asynchronous
          if (typeof $scope.sourceResult.success.response === "undefined") {}
          else {
            data = $scope.sourceResult;
            $scope.setPagingData(data,page,pageSize);
            //$('.row').trigger('resize');
          }
        }
      );
      //}, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
      if ((newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) || (newVal !== oldVal && newVal.pageSize !== oldVal.pageSize)) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.gridOptionsSource = {
      data: 'myData',
      enablePaging: true,
      enableRowSelection : true,
      multiSelect: false,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions,
      showFilter: true,
      selectedItems: $scope.mySelections,
      columnDefs: [
        {width:'50px',field:'', displayName:  $filter('i18n')('_NB_'), cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
        {visible:false,width:'*',field:'id', displayName:  $filter('i18n')('_ID_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'*',field:'title_t', displayName:  $filter('i18n')('_TITLE_'), cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>'},
        {width:'*',field:'query_s', displayName:  $filter('i18n')('_QUERY_'), cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>'}
      ],
      beforeSelectionChange: function (rowItem) { return true; },
      afterSelectionChange: function () {
        angular.forEach($scope.mySelections, function ( item ) {
          $scope.config.content = item.id;
          $scope.config.title = item.title_t;
          $scope.config.query = item.query_s;
        });
      }
    };
});
