'use strict';

angular.module('websoApp')
  .controller('SourceDataCtrl', function ($cookieStore, $scope,$resource,cfg) {

        $scope.totalItems = 30;
        $scope.currentPage = 2;
        $scope.maxSize = 15;
        $scope.itemsPerPage = 10;
        var $username = $cookieStore.get('username');        

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };




        /*
         Getting source
         */

        $scope.sourceData = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl', type_s:'source',user_s:$username,callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doSearch = function () {
            $scope.sourceResult = $scope.sourceData.get();


        };

        /*
         Deleting source
         */

        $scope.sourceDelete = $resource(cfg.urlServices+'db/:action',
            {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

        $scope.doDelete = function (sourceId,index) {
            /*
             Delete from Docs
             */
            $scope.sourceAddResult = $scope.sourceDelete.get({
                id  :     sourceId
            });
            /*
             Delete from table
             */
            $scope.sourceResult.success.response.docs.splice(index, 1);
        };



        $scope.doSearch();


        /*
         Test
         */
        $scope.test = function(id,url) {
            console.log("... Testing source update ..."+id+url)   ;
        };

  });

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1