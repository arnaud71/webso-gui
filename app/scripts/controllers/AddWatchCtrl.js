'use strict';

angular.module('websoApp')
    .controller('AddWatchCtrl', function ($scope,$resource,cfg,$modal) {

        /*
         Input fields - from sourceAdd & surveillanceAdd??
         */
        $scope.inputUrl = 'http://www.apache.org';
        $scope.inputTags = 'server';
        $scope.inputTitle = 'Apache home page';
       // $scope.inputDomain = $scope.domain;
        //$scope.inputActivity = 'Activité 1';
      //  $scope.inputFrequency = '1 semaine';
       // $scope.inputFolderName = 'Dossier de Surveillance 1';
        $scope.inputCreationDate = Date.now();



        $scope.watchAdd = $resource(cfg.urlServices+':action',
            {action:'put.pl', type_s:'watch',user_s:'user_0', level_sharing_i:'1',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

        $scope.sourceAdd = $resource(cfg.urlServices+':action',
            {action:'put.pl', type_s:'source',user_s:'user_0', level_sharing_i:'1' ,source_type_s:'rss',isWatched_b:'true',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doAdd = function () {
            $scope.watchAddResult = $scope.watchAdd.get({
                url_s  :        $scope.inputUrl,
                title_t:        $scope.inputTitle,
                tags_s :        $scope.inputTags,
                domain_s:       $scope.domain.name,
                activity_s:     $scope.activity.name,
                refresh_s:      $scope.frequency.option,
                folder_s:       $scope.folder.name,
                query_s:        $scope.inputQuery,
                notification_s: $scope.notification.option

            });
            $scope.sourceAddResult = $scope.sourceAdd.get({
                url_s  :        $scope.inputUrl,
                tags_s :        $scope.inputTags,
                title_t:        $scope.inputTitle,
                domain_s:       $scope.domain.name,
                activity_s:     $scope.activity.name,
                creation_d:     $scope.inputCreationDate

            });

           // var addWatch = alert('Surveillance ajoutée');
            // Testing  Modal trigger
            var modalInstance = $modal.open({
                templateUrl: 'addWatchModal.html',
                controller: ModalInstanceCtrl
            });

        };


        //  modal instance

        var ModalInstanceCtrl = function ($scope, $modalInstance) {

            $scope.ok = function () {
                $modalInstance.close();//($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        /*
         Domains menu
         */
        $scope.domains =  [
            {name:'domaine 1'},
            {name:'domaine 2'},
            {name:'domaine 3'}
        ] ;
        $scope.domain = $scope.domains[2];
        /*
         Activities menu
         */
        $scope.activities =  [
            {name:'Secteur dactivité 1'},
            {name:'Secteur dactivité 2'},
            {name:'Secteur dactivité 3'}
        ] ;
        $scope.activity = $scope.activities[2];

        /*
         Folders menu
         */
        $scope.folders =  [
            {name:'Dossier 1'},
            {name:'Dossier 2'},
            {name:'Dossier 3'}
        ] ;
        $scope.folder = $scope.folders[2];

        /*
         Frequency menu
         */
        $scope.frequencies =  [
            {option:'1 jour'},
            {option:'1 semaine'},
            {option:'1 mois'}

        ] ;
        $scope.frequency = $scope.frequencies[0];

         /*
         Notifications menu
         */
        $scope.notifications =  [
            {option:'Pas de notification'},
            {option:'email'}

        ] ;
        $scope.notification = $scope.notifications[0];


    });


//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1
