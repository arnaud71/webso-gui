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

angular.module('sample.widgets.affichageSurveillance', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('affichageSurveillance', {
        title: 'Surveillances',
        description: 'Surveillances',
        controller: 'surveillanceCtrl',
        templateUrl: 'scripts/controllers/widgets/affichageSurveillance/affichageSurveillance.html',
        reload: true,
        resolve: {
          id_source: function(config){
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
          templateUrl: 'scripts/controllers/widgets/affichageSurveillance/edit.html',
          controller: 'surveillanceEditCtrl'
        }
      });

  }).controller('surveillanceCtrl', function($scope, id_source, $resource, cfg){
    $scope.data = id_source;
    $scope.solr = $resource(cfg.urlDB+'solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

      $scope.solrResult = $scope.solr.get({sort:'updating_dt desc', rows:5, fq:'type_s:watch +id:'+id_source});

  }).controller('surveillanceEditCtrl', function($rootScope, $cookieStore, $location, $scope, $resource, cfg, $modal){

        $scope.mySelections = [];
        var usernameCookie = $cookieStore.get('username');

        $scope.watchList = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl', type_s:'watch', user_s: usernameCookie, callback:"JSON_CALLBACK"},
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
            $scope.watchResult = $scope.watchList.get({rows:pageSize,start:(page*pageSize-pageSize)},
                function() {        //call back function for asynchronous
                    if (typeof $scope.watchResult.success.response === "undefined") {}
                    else {
                        data = $scope.watchResult;
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
                {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
                {visible:true,width:'*',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'*',field:'title_t', displayName:  'Titre de la surveillance',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' }
            ],
        beforeSelectionChange: function (rowItem) { return true; },
        afterSelectionChange: function () {
            angular.forEach($scope.mySelections, function ( item ) {
                $scope.config.content = item.id;
                $scope.config.title = item.title_t;
            });
        }             
    };
  });