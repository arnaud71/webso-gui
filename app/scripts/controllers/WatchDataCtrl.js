'use strict';

angular.module('websoApp')
    .controller('WatchDataCtrl', function ($cookieStore, $scope,$resource,cfg) {

        var $username = $cookieStore.get('username');

        /*
         $scope.sourceData = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
         {action:'get.json', source_user:'user_1',callback:"JSON_CALLBACK"},
         {get:{method:'JSONP'}});
         */
        $scope.watchData = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl', type_s:'watch',user_s:$username, callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

        $scope.doSearch = function () {
            $scope.watchResult = $scope.watchData.get();
        };

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

        /*

         */


        $scope.doSearch();


    });

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1