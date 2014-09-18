'use strict';

angular.module('websoApp')
    .controller('WatchListCtrl', function ($cookieStore, $scope,$resource,cfg,$modal) {

        var $username = $cookieStore.get('username');

        /*
         Getting watch   List
         */

        $scope.watchList = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl', type_s:'watch',user_s:$username,callback:"JSON_CALLBACK"},
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
            enableRowSelection : false,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            showFilter: true,

            //selectWithCheckboxOnly: 'true',
            //selectedItems: $scope.mySelections,
            columnDefs: [
                {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
                {visible:false,width:'50px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'*',field:'url_s', displayName:  'Source',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },
                {width:'*',field:'title_t', displayName:  'Title', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'100px',field:'tags_s', displayName:  'Tag', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'100px',field:'domain_s', displayName:  'Domaine', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'100px',field:'user_s', displayName:  'Auteur', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'100px',field:'folder_s', displayName:  'Dossier', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'100px',field:'query_s', displayName:  'Surveillance', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'100px',field:'', displayName:  'Gestion', cellTemplate: ' <button type="button" class="btn btn-xs" ng-click="doDelete(row.getProperty(\'id\'),row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button><button type="button" class="btn btn-xs" ng-click="test(source.id,source.url_s)"><span class="glyphicon glyphicon-pencil"></span></button>'}

            ]
        };






        $scope.doSearch = function () {
            $scope.watchResult = $scope.watchList.get({type_s:'watch'},
                function() {        //call back function for asynchronous
                    if (typeof $scope.watchResult.success.response === "undefined") {}
                    else {
                        $scope.myData = $scope.watchResult.success.response.docs;

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



        /*
         Deleting source
         */

        $scope.watchDelete = $resource(cfg.urlServices+'db/:action',
            {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

        $scope.doDelete = function (watchId,index) {

            /*
             Confirm dialogs
             */

            var deleteWatch = confirm('Etes vous sûr de vouloir supprimer cette surveillance?');
            if (deleteWatch) {
                alert('Suppression confirmée');

                /*
                 Delete
                 */
                $scope.watchDeleteResult = $scope.watchDelete.get({
                    id  :     watchId
                });
                /*
                 Delete from table
                 */
                $scope.watchResult.success.response.docs.splice(index, 1);
            }

        };



        //$scope.doSearch();



    });

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1