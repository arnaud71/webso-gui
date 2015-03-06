'use strict';

angular.module('websoApp')
  .controller('ValidationListCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $filter, sharedService) {

    $scope.mySelections = [];
    var $username = $cookieStore.get('username');
    var $userRole = $cookieStore.get('userRole');
    var $token    = $cookieStore.get('token');
    var $token_timeout = $cookieStore.get('token_timeout');
    $scope.isError                = false;
    $scope.errorMessage           = $filter('i18n')('_ERROR_CONNECTION_');
    $scope.url                    = cfg.urlServices+'file/download.pl?token='+$token+'&token_timeout='+$token_timeout;

    /*
    Getting validation doc
     */
    /*if($userRole === 'administrateur'){
      $scope.validationList = $resource(cfg.urlServices+'db/:action',
          {action:'get.pl', type_s:'validation',user_s:'*',callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});
    }else{*/
      $scope.validationList = $resource(cfg.urlServices+'db/:action',
          {action:'get.pl', type_s:'validation',user_s:$username,callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});
    // }
    $scope.fileDownload = $resource(cfg.urlServices+'file/:action',
      {action:'download.pl'},//,callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'},
      post:{method:'POST'}});

    $scope.atomicChange = $resource(cfg.urlServices + 'db/:action',
      {action: 'change.pl', id: '', callback: "JSON_CALLBACK"},
      {put: {method: 'JSONP'}});

    $scope.doSearch = function () {
        $scope.validationResult = $scope.validationList.get();
    };

    $scope.doSearch();

    /*
     COPY source list
     */



    $scope.filterOptions = {
      filterText: "",
      useExternalFilter: false


    };

    $scope.sortInfo = {
      fields:['creation_dt'],
      directions:['desc']
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
        $scope.validationResult = $scope.validationList.get({rows:pageSize,start:(page*pageSize-pageSize)},
          function() {        //call back function for asynchronous
            $scope.isError = false;
            if (typeof $scope.validationResult.success !== "undefined") {
              if (typeof $scope.validationResult.success.response === "undefined") {
              }
              else {
                data = $scope.validationResult;
                $scope.setPagingData(data, page, pageSize);
                //$('.row').trigger('resize');
              }
            }
            else {
                $scope.isError = true;
            }

          },
          //error
          function () {
            $scope.isError = true;

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
      enableColumnResize : true,
      multiSelect: false,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions,
      showFilter: true,

      //selectWithCheckboxOnly: 'true',
      selectedItems: $scope.mySelections,
        afterSelectionChange: function () {
            $scope.selectedIDs = '';
            angular.forEach($scope.mySelections, function ( item ) {
                $scope.selectedIDs = item ;
            });
        },
      sortInfo            : $scope.sortInfo,
      columnDefs: [
        {width:'50px',field:'', displayName:  $filter('i18n')('_NB_'), cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
        {visible:false,width:'50px',field:'id', displayName:  $filter('i18n')('_ID_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        // {width:'*',field:'url_s', displayName:  $filter('i18n')('_SOURCE_'),cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
        {width:'*',field:'title_t', displayName:  $filter('i18n')('_TITLE_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'importance_i', displayName:  $filter('i18n')('_IMPORTANCE_'), cellTemplate: '<div class="ngCellText"<span style="display:block; height:50%; width:100%; background-color:{{row.getProperty(col.field) | importanceColor}}"></div>'}, //'{{row.getProperty(col.field)}}'},//' | importanceView}}'},
        {width:'150px',field:'tags_ss', displayName:  $filter('i18n')('_TAB_TAGS_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'200px',field:'comment_s', displayName:  $filter('i18n')('_COMMENTS_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'folder_s', displayName:  $filter('i18n')('_FOLDER_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'user_s', displayName:  $filter('i18n')('_AUTHOR_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},

        // {width:'100px',field:'IsWatched_b', displayName:  $filter('i18n')('_WATCH_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'creation_dt', displayName:  $filter('i18n')('_DATE_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'110px',field:'', displayName:  $filter('i18n')('_CRUD_MANAGEMENT_'), cellTemplate: '<button type="button" class="btn btn-xs" ng-click="edit(row)"><span class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-xs" ng-click="doDelete(row.getProperty(\'id\'),row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button> <a class="btn btn-xs" ng-show="row.getProperty(\'url_s\')" ng-href="{{row.getProperty(\'url_s\')}}" target="_blank" class="btn btn-xs"><span class="glyphicon glyphicon-link"></span></a> <a class="btn btn-xs" ng-show="row.getProperty(\'file_s\')" ng-href="{{url}}&fileID={{row.getProperty(\'file_s\')}}" target="_blank" class="btn btn-xs"><span class="glyphicon glyphicon-file"></span></a>'}
      ]
    };


    $scope.doSearch2 = function () {
      $scope.validationResult = $scope.validationList.get({type_s:'validation'},
        function() {        //call back function for asynchronous
          $scope.isError = false;
          if (typeof $scope.validationResult.success.response === "undefined") {}
          else {
            $scope.myData = $scope.validationResult.success.response.docs;

            $('.row').trigger('resize');
          }
        },
        //error
        function () {
          $scope.isError = true;

        }
      );


    };

    // Receive message to update grid
    $scope.$on('handleBroadcast', function(event, message) {
      $scope.doSearch2();
    });

    /*
     Deleting source
     */

    $scope.validationDelete = $resource(cfg.urlServices+'db/:action',
      {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});
    /*
     ** Confirm dialogs
     */
    $scope.doDelete = function (sourceId,index) {
      //var deleteSource = confirm('Etes vous sûr de vouloir supprimer cette validation?');

      var modalInstance = $modal.open({
        templateUrl: 'deleteValidationModal.html',
        controller: ModalInstanceDeleteCtrl

      });

      modalInstance.result.then(function () {
        $scope.validationDelete.get({
          id: sourceId,
          user_s: $username
        }).$promise.then(function () {

          $scope.myData.splice(index, 1);
          $scope.doSearch2();

        }, function (reason) {
          alert('Failed id: ' + reason);
        })
      })
    };

    var ModalInstanceDeleteCtrl = function ($scope, $modalInstance) {
      $scope.ok = function () {
        $modalInstance.close();//($scope.selected.item);
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    /*
      Edition
    */
    $scope.edit = function(obj){
      $scope.validationForm                   = {};
      $scope.validationForm.url               = '';
      $scope.validationForm.title             = '';
      $scope.validationForm.tags              = '';
      $scope.validationForm.detail            = '';
      $scope.validationForm.comment           = '';
      $scope.validationForm.folder            = {};
      $scope.validationForm.folder.name       = '';
      $scope.validationForm.folder.id         = '';
      $scope.validationForm.importance        = '';

      var modalInstance = $modal.open({
        templateUrl: 'editValidationModal.html',
        controller: ModalInstanceEditCtrl,
        scope: $scope,
        resolve: {
          data: function () {
            return obj.entity;
          }
        }
      });

      modalInstance.result.then(function (result) {
        $scope.atomicChange.put({
          id            : result.id,
          url_s         : result.url,
          tags_ss       : result.tags,
          title_t       : result.title,
          detail_s      : result.detail,
          comment_s     : result.comment,
          folder_s      : result.folder.name,
          folder_i      : result.folder.id,
          importance_i  : result.importance
        }).$promise.then(function () {
          $scope.doSearch2();
        });
      });
    }

    var ModalInstanceEditCtrl = function ($scope, $modalInstance, data) {
      $scope.validationForm                   = {};
      $scope.validationForm.id                = data.id;
      $scope.validationForm.url               = data.url_s;
      $scope.validationForm.title             = data.title_t;
      $scope.validationForm.tags              = data.tags_ss;
      $scope.validationForm.detail            = data.detail_s;
      $scope.validationForm.comment           = data.comment_s;
      $scope.validationForm.folder            = {'id': data.folder_i,'name': data.folder_s};
      $scope.validationForm.folders           = $scope.folders;
      $scope.validationForm.importance        = data.importance_i;


      $scope.ok = function () {
        $modalInstance.close($scope.validationForm);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    };

    $scope.dbList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',user_s:$username,callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    // ***************************************************************
    // doSearchFolder
    // list the available sources
    $scope.doSearchFolder = function () {
      $scope.isError = false;

      $scope.dbList.get({
        type_s      : 'tree',
        title_t     : 'vfolder',
        user_s      : $username,
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

    //$scope.doSearch();
  });
