'use strict';

angular.module('websoApp')
    .controller('AddWatchCtrl', function ($scope,$resource,cfg,$modal,$log) {

        /*
         Input fields - from sourceAdd & surveillanceAdd??
         */
        $scope.inputUrl       = '';
        $scope.inputTags      = '';
        $scope.inputTitle     = '';
        $scope.checkingSource = false;
        $scope.sourcecheched  = false;
       // $scope.inputDomain = $scope.domain;
        //$scope.inputActivity = 'Activité 1';
      //  $scope.inputFrequency = '1 semaine';
       // $scope.inputFolderName = 'Dossier de Surveillance 1';
        //$scope.inputCreationDate = Date.now();

        $scope.addResource = $resource(cfg.urlServices+'db/:action',
            {action:'put.pl',user_s:'user_0', level_sharing_i:'1',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}}
        );

        $scope.solrResource = $resource(cfg.urlDB+'solr/collection1/:action',
            {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
            {get:{method:'JSONP'}}
        );

       /* $scope.sourceAddResource = $resource(cfg.urlServices+':action',
            {action:'put.pl', type_s:'source',user_s:'user_0', level_sharing_i:'1' ,source_type_s:'rss',isWatched_b:'true',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});
*/

        $scope.checkSourceResource = $resource(cfg.urlServices+'harvester/RSS/:action',
            {action:'check_rss.pl',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}}
        );



        $scope.doAddSource = function () {


            $scope.sourceAddResult = $scope.addResource.get({
              source_type_s   : 'rss',
              type_s          : 'source',
              url_s           : $scope.inputUrl,
              tags_s          : $scope.inputTags,
              title_t         : $scope.inputTitle,
              //domain_s:       $scope.domain.name,
              //activity_s:     $scope.activity.name,
              refresh_s       : $scope.frequency.option

            },function () {

            });


            var modalInstance = $modal.open({
              templateUrl: 'addSourceModal.html',
              controller: ModalInstanceCtrl
            });


        };


        $scope.doAddWatch = function () {


          $scope.watchAddResult = $scope.addResource.get({
            type_s:         'watch',
            url_s  :        $scope.inputUrl,
            title_t:        $scope.inputTitle,
            tags_ss :       $scope.inputTags,
            domain_s:       $scope.domain.name,
            activity_s:     $scope.activity.name,
            folder_s:       $scope.folder.name,
            query_s:        $scope.inputQuery,
            //source_id_s:    $scope.sourceAddResult.success.id,
            notification_s: $scope.notification.option

          });


          // var addWatch = alert('Surveillance ajoutée');
          // Testing  Modal trigger
          var modalInstance = $modal.open({
            templateUrl: 'addWatchModal.html',
            controller: ModalInstanceCtrl
          });


    };

    $scope.checkSourceUrl = function (){
      //$scope.$emit('CHECKRSS');

      if ($scope.inputUrl.length>5) {
        $scope.checkingSource = true;
        $scope.checkSourceResult = $scope.checkSourceResource.get({
          url: $scope.inputUrl
        }, function () {
          if ($scope.checkSourceResult.title) {
            $scope.inputTitle = $scope.checkSourceResult.title;
          }
          //$scope.$emit('UNCHECKRSS');
          $scope.checkingSource = false;
          $scope.sourceChecked = true;
        });
      }
      else {
        $scope.sourceChecked = false;
      }

    };

  $scope.testWatch = function() {
    $scope.solrResult       = $scope.solrResource.get({q:$scope.inputQuery}

    );
  }


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
            {option:'1h'},
            {option:'12h'},
            {option:'24h'},
            {option:'48h'}

        ] ;
        $scope.frequency = $scope.frequencies[1];

         /*
         Notifications menu
         */
        $scope.notifications =  [
            {option:'Pas de notification'},
            {option:'email'}

        ] ;
        $scope.notification = $scope.notifications[0];

        //$scope.$on('CHECKRSS',function(){$scope.checkingSource=true});
        //$scope.$on('UNCKECKRSS',function(){$scope.checkingSource=false});
    });


//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1
