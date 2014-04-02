'use strict';

angular.module('websoApp')
    .controller('AddWatchCtrl', function ($scope,$resource,cfg) {

        /*
         Input fields - from sourceAdd & surveillanceAdd??
         */
        $scope.inputUrl = 'http://www.apache.org';
        $scope.inputTags = 'server';
        $scope.inputTitle = 'Apache home page';
        $scope.inputDomain = 'Domaine 1';
        $scope.inputActivity = 'Activité 1';
        $scope.inputFrequency = '1 semaine';
        $scope.inputFolderName = 'Dossier de Surveillance 1';
        $scope.inputCreationDate = Date.now();



        $scope.watchAdd = $resource(cfg.urlServices+':action',
            {action:'put.pl', type_s:'watch',user_s:'user_0', level_sharing_i:'1',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

        $scope.sourceAdd = $resource(cfg.urlServices+':action',
            {action:'put.pl', type_s:'source',user_s:'user_0', level_sharing_i:'1' ,source_type_s:'rss',isWatched_b:'true',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doAdd = function () {
            $scope.watchAddResult = $scope.watchAdd.get({
                url_s  :     $scope.inputUrl,
                title_t: $scope.inputTitle,
                domain_s: $scope.inputDomain,
                activity_s: $scope.inputActivity,
                frequency_s: $scope.inputFrequency,
                folder_name_s: $scope.inputFolderName

            });
            $scope.sourceAddResult = $scope.sourceAdd.get({
                url_s  :     $scope.inputUrl,
                tags_s :    $scope.inputTags,
                title_t:    $scope.inputTitle,
                domain_s: $scope.inputDomain,
                activity_s: $scope.inputActivity,
                creation_d: $scope.inputCreationDate



            });

            var addWatch = alert('Surveillance ajoutée');

        };



    });

/*

 angular.module('websoApp')
 .controller('addInfoCtrl', function ($scope,$resource) {

 //  $scope.inputType    = 'rss';
 $scope.inputLevel   = 0;
 // $scope.inputUser    = 'user_1';
 $scope.inputUrl     ='';
 $scope.inputTitle   = '';
 $scope.inputDetail = '';
 $scope.inputComment= '';
 $scope.inputRefresh = 1440; // per day


 $scope.informationAdd = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
 {action:'put_Information.json', source_user:'user_2' ,information_url:'',information_type:'information',information_title:'',information_detail:'',information_comment:'',information_level_sharing:'0',callback:"JSON_CALLBACK"},
 {get:{method:'JSONP'}});

 $scope.doAdd = function () {

 $scope.informationAddResult = $scope.informationAdd.get({

 information_url:     $scope.inputUrl,
 information_type:    $scope.inputType,
 //information_user:    $scope.inputUser,
 information_level_sharing:   $scope.inputLevel,
 information_title:   $scope.inputTitle,
 information_detail:   $scope.inputDetail,
 information_comment:   $scope.inputComment
 });
 };




 });

 */

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1
