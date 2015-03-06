'use strict';

angular.module('websoApp')
  .controller('SourceListCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $window, $filter) {

    var $username = $cookieStore.get('username');     
    /*
    Getting source
    */

    $scope.sourceList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl', user_s:$username, callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.atomicChange = $resource(cfg.urlServices + 'db/:action',
      {action: 'change.pl', id: '', callback: "JSON_CALLBACK"},
      {put: {method: 'JSONP'}});

    $scope.watch = $resource(cfg.urlServices + 'db/:action',
      {action: 'put.pl', user_s:$username, callback: "JSON_CALLBACK"},
      {put: {method: 'JSONP'}});

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

    $scope.sortInfo = {
      fields:['creation_dt'],
      directions:['desc']
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
      $scope.sourceResult = $scope.sourceList.get({type_s:'source',rows:pageSize,start:(page*pageSize-pageSize)},
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
      sortInfo: $scope.sortInfo,

      //selectWithCheckboxOnly: 'true',
      //selectedItems: $scope.mySelections,
      columnDefs: [
        {width:'50px',field:'', displayName: $filter('i18n')('_NB_'), cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
        {visible:false,width:'50px',field:'id', displayName: $filter('i18n')('_ID_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'*',field:'url_s', displayName: $filter('i18n')('_SOURCE_'),cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },
        {width:'*',field:'title_t', displayName: $filter('i18n')('_TITLE_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'150px',field:'tags_ss', displayName: $filter('i18n')('_TAB_TAGS_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        // {width:'100px',field:'domain_s', displayName: $filter('i18n')('_DOMAIN_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'user_s', displayName: $filter('i18n')('_AUTHOR_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        //{width:'100px',field:'IsWatched_b', displayName: 'Surveillance', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'creation_dt', displayName: $filter('i18n')('_CREATION_'), cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'', displayName: $filter('i18n')('_CRUD_MANAGEMENT_'), cellTemplate: '<button type="button" class="btn btn-xs" ng-click="edit(row)"><span class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-xs" ng-click="doDelete(row.getProperty(\'id\'),row.rowIndex)" tooltip="Effacer le document"><span class="glyphicon glyphicon-trash"></span></button> <button type="button" class="btn btn-xs" ng-click="doWatch(row)" tooltip="Monitor"><span class="glyphicon glyphicon-eye-open"></span></button>'}
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

    // Receive message to update grid
    $scope.$on('handleBroadcast', function(event, message) {
      $scope.doSearch();
    });

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
    };

    $scope.doWatch = function(obj){
      $scope.ModalForm                   = {};
      $scope.ModalForm.url               = '';
      $scope.ModalForm.title             = '';
      $scope.ModalForm.tags              = '';
      $scope.ModalForm.query             = '';
      $scope.ModalForm.notification      = {option: ''};
      $scope.ModalForm.frequency         = {option: ''};

      var modalInstance = $modal.open({
        templateUrl: 'WatchModal.html',
        controller: ModalInstanceWatchCtrl,
        scope: $scope,
        resolve: {
          data: function () {
            return obj.entity;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if(result.id == '') alert('System error');
        if(result.title == '' || result.tags == '' || angular.isUndefined(result.folder) || angular.isUndefined(result.frequency) || angular.isUndefined(result.notification)) alert('Remplir les champs *');
        else{
          $scope.watch.put({
            type_s         : 'watch',
            title_t        :  result.title,
            tags_ss        :  result.tags,
            folder_i       :  result.folder.id,
            folder_s       :  result.folder.name,
            query_s        :  result.query,
            source_id_ss   :  result.id,
            refresh_s      :  result.frequency.option,
            notification_s :  result.notification.option
          }).$promise.then(function () {
              $scope.doSearch();
          });
        }
      });
    }

    var ModalInstanceWatchCtrl = function ($scope, $modalInstance, data) {
      $scope.ModalForm                   = {};
      $scope.ModalForm.id                = data.id;
      $scope.ModalForm.url               = data.url_s;
      $scope.ModalForm.title             = data.title_t;
      $scope.ModalForm.tags              = data.tags_ss;
      $scope.ModalForm.frequencies       = [{option:'1h'}, {option:'12h'}, {option:'24h'}, {option:'48h'}];

      $scope.ok = function () {
        $modalInstance.close($scope.ModalForm);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    };

    $scope.edit = function(obj){
      $scope.ModalForm                   = {};
      $scope.ModalForm.url               = '';
      $scope.ModalForm.title             = '';
      $scope.ModalForm.tags              = '';
      $scope.ModalForm.frequency         = {option: ''};
      $scope.ModalForm.domain            = {name: ''};
      $scope.ModalForm.activity          = {name: ''};

      var modalInstance = $modal.open({
        templateUrl: 'editSourceModal.html',
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
          refresh_s     : result.frequency.option,
          // domain_s      : result.domain.name,
          // activity_s    : result.activity.name,
        }).$promise.then(function () {
            $scope.doSearch();
        });
      });
    }

    var ModalInstanceEditCtrl = function ($scope, $modalInstance, data) {
      $scope.ModalForm                   = {};
      $scope.ModalForm.id                = data.id;
      $scope.ModalForm.url               = data.url_s;
      $scope.ModalForm.title             = data.title_t;
      $scope.ModalForm.tags              = data.tags_ss;
      $scope.ModalForm.frequency         = {option: data.refresh_s};
      $scope.ModalForm.frequencies       = [{option:'1h'}, {option:'12h'}, {option:'24h'}, {option:'48h'}];
      // $scope.ModalForm.domain            = {'name': data.domain_s};
      // $scope.ModalForm.domains           = $scope.domains;
      // $scope.ModalForm.activity          = {'name': data.activity_s};


      $scope.ok = function () {
        $modalInstance.close($scope.ModalForm);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    };

    // doSearchFolder
    // list the available sources
    $scope.doSearchFolder = function () {
      $scope.isError = false;

      $scope.sourceList.get({
        type_s      : 'tree',
        title_t     : 'wfolder',
        user_s      : $username,
      }).$promise.then(function(result) {
        $scope.folders = [];
        $scope.folderArray = [];
        if(angular.isDefined(result.success.response.docs[0].content_s)){
          var tmp = JSON.parse(result.success.response.docs[0].content_s);
          angular.forEach(tmp[0].nodes, function(value1, key1) {
            $scope.folders.push({"id":value1.id ,"name":value1.title});
            angular.forEach(value1.nodes, function(value2, key2){
              $scope.folders.push({"id":value2.id , "name":value2.title});
              angular.forEach(value2.nodes, function(value3, key3){
                $scope.folders.push({"id":value3.id, "name":value3.title});
                if(angular.isArray(value3.nodes)){
                  angular.forEach(value3.nodes, function(value4, key4){
                    $scope.folders.push({"id":value4.id, "name":value4.title});
                  });
                }
              });
            });
          });
        }
      }, function(reason) {
        alert('Failed: ' + reason);
      });
    };
    $scope.doSearchFolder();

    //$scope.doSearch();
    /*
    Domains menu
    */
    $scope.domains =  $filter('i18n')('_DOMAIN_AND_ACTIVITY_LIST_');
    $scope.notifications =  $filter('i18n')('_NOTIFICATION_TYPES_');

  });
