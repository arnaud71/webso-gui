'use strict';

angular.module('websoApp')
  .controller('SourceListCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $window, $filter) {

        var $username = $cookieStore.get('username');     
/*
     Getting source
     */

    $scope.sourceList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl', type_s:'source',user_s:$username, callback:"JSON_CALLBACK"},
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
      //var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
      $scope.myData = data;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
     // setTimeout(function () {
        var data;
        $scope.sourceResult = $scope.sourceList.get({rows:pageSize,start:(page*pageSize-pageSize)},
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
      enableRowSelection : false,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions,
      showFilter: true,

      //selectWithCheckboxOnly: 'true',
      //selectedItems: $scope.mySelections,
      columnDefs: [
        {width:'50px',field:'', displayName:  $filter('i18n')('_NB_'), cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
        {visible:false,width:'50px',field:'id', displayName:  $filter('i18n')('_ID_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'*',field:'url_s', displayName:  $filter('i18n')('_SOURCE_'),cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },
        {width:'*',field:'title_t', displayName:  $filter('i18n')('_TITLE_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'tags_s', displayName:  $filter('i18n')('_TAB_TAGS_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'domain_s', displayName:  $filter('i18n')('_DOMAIN_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'user_s', displayName:  $filter('i18n')('_AUTHOR_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        //{width:'100px',field:'IsWatched_b', displayName:  'Surveillance', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'creation_dt', displayName:  $filter('i18n')('_CREATION_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'', displayName:  $filter('i18n')('_CRUD_MANAGEMENT_'), cellTemplate: ' <button type="button" class="btn btn-xs" ng-click="doDelete(row.getProperty(\'id\'),row.rowIndex)" tooltip="Effacer le document"><span class="glyphicon glyphicon-trash"></span></button>'}
        //<button type="button" class="btn btn-xs" ng-click="edit(source.id,source.url_s)"><span class="glyphicon glyphicon-pencil"></span></button>
      ]
    };

    $scope.addWatch = function (sourceId){
      $window.location.href = '#/watch/add';
    }




    $scope.doSearch = function () {
      $scope.sourceResult = $scope.sourceList.get({type_s:'source'},
        function() {        //call back function for asynchronous
          if (typeof $scope.sourceResult.success.response === "undefined") {}
          else {
            $scope.myData = $scope.sourceResult.success.response.docs;

            $('.row').trigger('resize');
          }
        }
      );


    };

    /*
     Deleting source
     */

    $scope.sourceDelete = $resource(cfg.urlServices+'db/:action',
      {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.doDelete = function (sourceId,index) {


        /*
         Confirm dialogs
         */

        var deleteSource = confirm($filter('i18n')('_ARE_YOU_SURE_DEL_SOURCE_'));
        if (deleteSource) {
            alert($filter('i18n')('_DEL_CONFIRM_'));

            /*
             Delete from Docs
             */
            $scope.sourceAddResult = $scope.sourceDelete.get({
                id  :     sourceId
            });
            /*
             Delete from table
             */
            $scope.myData.splice(index, 1);
        }

        //  $('#myModal').modal('show');



      //$('.row').trigger('resize');
      //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);



    };





    //$scope.doSearch();



  });

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1