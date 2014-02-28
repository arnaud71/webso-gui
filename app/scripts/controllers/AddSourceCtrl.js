'use strict';

angular.module('websoApp')
    .controller('AddSourceCtrl', function ($scope,$resource,cfg) {

        /*
         Input fields - from sourceAdd & surveillanceAdd??
         */
        $scope.inputUrl = 'http://www.apache.org';
        $scope.inputTags = 'server';
        $scope.inputTitle = 'Apache home page';
        $scope.inputDomain = 'Domaine 1';
        $scope.inputActivity = 'Activité 1';
        $scope.inputCreationDate = Date.now();


        $scope.sourceAdd = $resource(cfg.urlServices+':action',
            {action:'put.pl', type_s:'source',user_s:'user_0', level_sharing_i:'1' ,source_type_s:'rss',isWatched_b:'false',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doAdd = function () {
            $scope.sourceAddResult = $scope.sourceAdd.get({
                url_s  :     $scope.inputUrl,
                tags_s :    $scope.inputTags,
                title_t:    $scope.inputTitle,
                domain_s: $scope.inputDomain,
                Activity_s: $scope.inputActivity,
                creation_d: $scope.inputCreationDate

            });

        };



    });

/*
 "url_s": "http://www.plos.org/feed/",
 "type_s": "source",
 "user_s": "user_0",
 "level_sharing_i": 1,
 "source_type_s": "rss",
 "id": "s_8e53acb2ab186c690ad1448f3fa26a75",
 "_version_": 1460213573609324500

 */

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1
