'use strict';

angular.module('websoApp')
    .controller('SolrCtrl', function ($scope,$resource) {

        $scope.solr = $resource('http://albator.hesge.ch\\:8587/solr/collection1/:action',
            {action:'select', q:'pantene', wt:'json' , 'json.wrf':"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doSearch = function () {
            if ($scope.searchTerm) {
                $scope.solrResult = $scope.solr.get({q:$scope.searchTerm});
                }
            };
    });


// http://albator.hesge.ch:8587/solr/collection1/select?q='+query+'&wt=json&json.wrf=?&callback=?'

angular.module('websoApp')
    .controller('GoogleFeedCtrl', function ($scope,$resource) {


        $scope.googleFeed = $resource('https://ajax.googleapis.com/ajax/services/feed/:action',
            {action:'find', v:'1.0',q:'technology', callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doSearch = function () {
                if ($scope.searchTerm) {
                    $scope.googleFeedResult = $scope.googleFeed.get({q:$scope.searchTerm});
                }
        };
    });

//https://ajax.googleapis.com/ajax/services/feed/find?v=1.0&q=Official%20Google%20Blog&userip=INSERT-USER-IP"


angular.module('websoApp')
    .controller('SourceDataCtrl', function ($scope,$resource) {

/*
        $scope.sourceData = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
            {action:'get.json', source_user:'user_1',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});
*/
        $scope.sourceData = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
            {action:'get.json', source_user:'user_1',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

        $scope.doSearch = function () {
            $scope.sourceResult = $scope.sourceData.get();
        };

        $scope.doSearch();
    });

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1

angular.module('websoApp')

    .controller('AddSourceCtrl', function ($scope,$resource) {

        $scope.inputType    = 'rss';
        $scope.inputRefresh = 1440; // per day
        $scope.inputLevel   = 0;
        $scope.inputUser    = 'user_1';

        $scope.sourceAdd = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
            {action:'put.json', source_user:'user_1' ,source_url:'',source_type:'rss',source_level_sharing:'0',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

        $scope.doAdd = function () {
            $scope.sourceAddResult = $scope.sourceAdd.get({   source_url:     $scope.inputUrl,
                                                        source_type:    $scope.inputType,
                                                        source_user:    $scope.inputUser,
                                                        source_level:   $scope.inputLevel

            });
        };


    });

// http://albator.hesge.ch/cgi-bin/webso/sources/put.json?source_url=http://www.site.com/rss&source_type=rss&source_user=user_1&source_level_sharing=0
