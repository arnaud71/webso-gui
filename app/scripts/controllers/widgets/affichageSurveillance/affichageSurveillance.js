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

  }).controller('surveillanceCtrl', function($scope, id_source, $resource, cfg, $modal, $cookieStore){
    var $username = $cookieStore.get('username');
    var $token    = $cookieStore.get('token');
    var $token_timeout = $cookieStore.get('token_timeout');

    $scope.data = id_source;
    // $scope.solr = $resource(cfg.urlDB+'solr/collection1/:action',
    //     {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
    //     {get:{method:'JSONP'}});
    $scope.solr = $resource(cfg.urlServices+'db/:action',
        {action:'query.pl', qt:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
        {get:{method:'JSONP'}});
    
    // $scope.Result = $scope.solr.get({sort:'updating_dt desc', rows:5, fq:'type_s:watch AND id:'+id_source});
    $scope.solr.get({sort:'updating_dt desc', rows:5, fq:'type_s:watch AND id:'+id_source})
        .$promise.then(function(result){
            if(result.success.response.numFound){
                // Result = result.success.response.docs[0].source_id_s;
                $scope.watchData = result.success.response.docs[0];
                var source = '';
                var b = false;
                angular.forEach(result.success.response.docs[0].source_id_ss, function(key, val){
                    source += ((b)? ' OR ': '')+'source_id_ss:'+key;
                    b=true;
                });
                $scope.solr.get({sort:'date_dt desc', rows:5, q:result.success.response.docs[0].query_s, fq:'type_s:document AND ('+source+')'})
                    .$promise.then(function(data){
                        $scope.solrResult = data;
                    });
            }
        });
    // $scope.solrResult = $scope.solr.get({sort:'updating_dt desc', rows:5, fq:'type_s:watch AND id:'+id_source});

    $scope.addResource = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl',user_s:$username,callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

    $scope.dbList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',user_s:$username,callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

    $scope.atomicChange = $resource(cfg.urlServices + 'db/:action',
      {action: 'change.pl', id: '', callback: "JSON_CALLBACK"},
      {put: {method: 'JSONP'}});

    $scope.sendMail = $resource(cfg.urlServices+':action',
      {action: 'send.pl', callback:'JSON_CALLBACK', token: $token, token_timeout: $token_timeout},
      {send: {method: 'JSONP'}});

    $scope.validateDoc = function (doc, validate, type) {

      if (validate) {

        $scope.validationForm = {};
        if (type == 'solr') {
          $scope.validationForm.url = doc.url_s;
          $scope.validationForm.title = doc.title_t;
          $scope.validationForm.content = doc.content_t;
        }
        else if (type == 'online') {
          $scope.validationForm.url = doc.link;
          $scope.validationForm.title = doc.title;
          $scope.validationForm.content = doc.description;
        }
        $scope.validationForm.tags     = '';
        $scope.validationForm.folder   = '';
        $scope.validationForm.comment  = '';
        $scope.validationForm.importance = '';

        var modalInstance = $modal.open({
          scope: $scope,
          templateUrl : 'views/modals/validateModal.html',
          controller  : ModalInstanceCtrl,
        });

        modalInstance.result.then(function () {
          if($scope.validationForm.url == '' || $scope.validationForm.folder.id == '' || $scope.validationForm.comment == '' || $scope.validationForm.importance == '') {
            alert($filter('i18n')('_ERROR_VALIDATE_ADD_'));
          }
          else{
            $scope.addResource.get({
              type_s        : 'validation',
              url_s         : $scope.validationForm.url,
              tags_ss       : $scope.validationForm.tags,
              title_t       : $scope.validationForm.title,
              content_en    : $scope.validationForm.content,
              content_t     : $scope.validationForm.content,
              content_fr    : $scope.validationForm.content,
              comment_s     : $scope.validationForm.comment,
              folder_s      : $scope.validationForm.folder.name,
              folder_i      : $scope.validationForm.folder.id,
              importance_i  : $scope.validationForm.importance,
              lang_s        : doc.lang_s,
              date_dt       : doc.date_dt
            }).$promise.then(function (result) {
              $modal.open({
                templateUrl : 'views/modals/validateSuccessModal.html',
                controller  : ModalInstanceCtrl,
              });
            });

            $scope.atomicChange.put({
              id            : doc.id,
              validated_b   : validate
            }).$promise.then(function (result) {
              // $scope.doSearch();
            });

          }
        });

      }
      else {
        //TODO remove validation
        $scope.atomicChange.put({
          id            : doc.id,
          validated_b   : validate
        }).$promise.then(function (result) {
            // $scope.doSearch();
          }
        );

      }
    };

    $scope.shareDoc = function (doc, type) {

      $scope.shareForm = {};
      if (type == 'solr') {
        $scope.shareForm.url = doc.url_s;
        $scope.shareForm.title = doc.title_t;
        $scope.shareForm.content = doc.content_t;
      }
      else if (type == 'online') {
        $scope.shareForm.url = doc.link;
        $scope.shareForm.title = doc.title;
        $scope.shareForm.content = doc.description;
      }
      $scope.shareForm.tags     = '';
      $scope.shareForm.folder   = '';
      $scope.shareForm.comment  = '';
      $scope.shareForm.mail     = '';

      var modalInstance = $modal.open({
        scope: $scope,
        templateUrl : 'views/modals/shareModal.html',
        controller  : ModalInstanceCtrl,
      });

      modalInstance.result.then(function () {
        if($scope.shareForm.mail == '' || angular.isUndefined($scope.shareForm.mail)) {
            $modal.open({
                scope: $scope,
                templateUrl : 'views/modals/shareErrorModal.html',
                controller  : ModalInstanceCtrl,
            });
            // alert($filter('i18n')('_WRONG_MAIL_FORMAT_'));
        }
        else{
          $scope.sendMail.send({
            token         : $token,
            token_timeout : $token_timeout,
            url_s         : $scope.shareForm.url,
            tags          : $scope.shareForm.tags,
            titre         : $scope.shareForm.title,
            // content_en    : $scope.shareForm.content,
            content       : $scope.shareForm.content,
            // content_fr    : $scope.shareForm.content,
            commentaire   : $scope.shareForm.coment,
            // folder_s      : $scope.shareForm.folder.name,
            // folder_i      : $scope.shareForm.folder.id,
            langue        : doc.lang_s,
            date          : doc.date_dt,
            mail          : $scope.shareForm.mail
          });
        }
      });
    };

    //  ***************************************
    //  modal instance
    var ModalInstanceCtrl = function ($scope, $modalInstance) {

      $scope.ok = function () {
        $modalInstance.close();//($scope.selected.item);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    // doSearchFolder
    // list the available sources
    $scope.doSearchFolder = function () {
      $scope.isError = false;

      $scope.dbList.get({
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
                {visible:false ,width:'*',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'*',field:'title_t', displayName:  'Titre de la surveillance',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'query_s', displayName:  'Requête', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>'},
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