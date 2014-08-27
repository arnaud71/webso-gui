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
  }).controller('collectesMultisourcesCtrl', function($scope, data, $resource, cfg){
    $scope.data = data;

    $scope.solr = $resource(cfg.urlDB+'solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

      $scope.solrResult       = $scope.solr.get({sort:'date_dt desc', rows:5, fq:'type_s:document +source_id_ss:'+data});

    $scope.querySearch = $resource(cfg.urlServices+'harvester/QUERYSEARCH/:action',
      {action:'get_querysearch.pl', query:'', type:''},
      {get:{method:'JSONP'}});

    $scope.querySearchResult       = $scope.querySearch.get({sort:'date_dt desc', rows:5, fq:'type_s:document +source_id_ss:'+data});



  }).controller('collectesMultisourcesEditCtrl', function($rootScope, $cookieStore, $location, $scope, $resource, cfg, $modal){


    $scope.person = {};
    $scope.people = [
      { name: 'Adam',      email: 'adam@email.com',      age: 10 },
      { name: 'Amalie',    email: 'amalie@email.com',    age: 12 },
      { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30 },
      { name: 'Samantha',  email: 'samantha@email.com',  age: 31 },
      { name: 'Estefanía', email: 'estefanía@email.com', age: 16 },
      { name: 'Natasha',   email: 'natasha@email.com',   age: 54 },
      { name: 'Nicole',    email: 'nicole@email.com',    age: 43 },
      { name: 'Adrian',    email: 'adrian@email.com',    age: 21 }
    ];



    $scope.queryTypes = cfg.querySearchTypeList;

    $scope.type = {};
    $scope.type.selected = undefined;




        $scope.mySelections = [];
        var usernameCookie = $cookieStore.get('username');

        $scope.sourcesList = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl', type_s:'source', user_s: usernameCookie, callback:"JSON_CALLBACK"},
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
                {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
                {visible:true,width:'*',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'*',field:'title_t', displayName:  'Titre de la source',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' }
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
