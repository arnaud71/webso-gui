'use strict';

angular.module('websoApp')
    .controller('UsersCtrl', function ($scope,$resource,cfg,$modal) {


        /*
         Getting watch   List
         */

        $scope.userList = $resource(cfg.urlServices+':action',
            {action:'get.pl', type_s:'enregistrement',callback:"JSON_CALLBACK"},
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
            $scope.watchResult = $scope.userList.get({rows:pageSize,start:(page*pageSize-pageSize)},
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
                {width:'*',field:'user_s', displayName:  'Utilisateur',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'role_s', displayName:  'Rôle',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'100px',field:'', displayName:  'Gestion', cellTemplate: ' <center><button type="button" class="btn btn-xs" ng-click="deleteCount(row.getProperty(\'id\'),row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button></center>'}

            ]
        };


    $scope.userResult = $scope.userList.get({type_s:'enregistrement'},
        function() {        //call back function for asynchronous
            if (typeof $scope.userResult.success.response === "undefined") {}
            else {
                $scope.myData = $scope.userResult.success.response.docs;

                $('.row').trigger('resize');
            }
        }
    );

// suppression d'un utilisateur
        $scope.countDelete = $resource(cfg.urlServices+':action',
          {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});

    $scope.deleteCount = function (userId, index) {
        /*
         Confirm dialogs
         */
        var deleteSource = confirm('Etes vous sûr de vouloir supprimer cet utilisateur ?');
        if (deleteSource) {
            /*
             Delete from Docs
             */
            $scope.sourceAddResult = $scope.countDelete.get({
                id  :     userId
            });
            /*
             Delete from ng-grid table
             */
            $scope.userResult.success.response.docs.splice(index, 1);
        }
    };
});