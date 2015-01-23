'use strict';

angular.module('websoApp')
  .controller('GoogleFeedCtrl', function ($scope,$resource,cfg,$cookieStore,$modal) {

    var $username = $cookieStore.get('username');

    $scope.model = {
      msgSelect           : 'Selectionner tout',
      msgAdd              : 'Ajouter source',
      foundRes            : 0,
      searchTerm          : '',
      mySelections        : [],

    };

    $scope.isError                = false;
    $scope.errorMessage           = cfg.errorConnect;


   /* $scope.googleFeed = $resource('https://ajax.googleapis.com/ajax/services/feed/:action',
      {action:'find', v:'1.0',q:'technology', callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});
*/
    $scope.googleFeed     = $resource(cfg.urlServices+'harvester/RSS/:action',
      {action:'get_list_rss.pl',query:'technology', callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}
      });


    // to add an object to the db
    $scope.addRss = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl',user_s:$username, level_sharing_i:'1',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}}
    );



//        $scope.myData = [{name: "Moroni", age: 50},
//            {name: "Tiancum", age: 43},
//            {name: "Jacob", age: 27},
//            {name: "Nephi", age: 29},
//            {name: "Enos", age: 34}];
//
    $scope.gridOptions = {
      data: 'myData',

      //selectWithCheckboxOnly: 'true',
      selectedItems: $scope.model.mySelections,
      showSelectionCheckbox: true,

      columnDefs: [
        {width:'60px',field:'api', displayName: 'From', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
        {width:'40px',field:'language', displayName: 'Lang', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
        {field:'url', displayName: 'Source', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },
        {field:'title', displayName:'Title', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {field:'link', displayName: 'Website', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },

      ]
    };

    $scope.fixGridRendering = function() {
      $(window).resize();
      $('.row').trigger('resize');
      $('#search-new-feeds').trigger('resize');
    };

    $scope.doSearch = function () {
      if ($scope.model.searchTerm) {
        $scope.googleFeedResult = $scope.googleFeed.get(
          {query:$scope.model.searchTerm},
          function() {        //call back function for asynchronous
            //$scope.foundRes = $scope.googleFeedResult.responseData.entries.length;
            //var myData =  $.parseJSON(JSON.parse($scope.googleFeedResult.responseData.entries));
            //$scope.myData  =  myData;
            if (typeof $scope.googleFeedResult.res === "undefined") {}
            else {
              $scope.model.foundRes = $scope.googleFeedResult.count;
              $scope.myData   = $scope.googleFeedResult.res;

              $('.row').trigger('resize');
              $('#search-new-feeds').trigger('resize');

            }

            //sleep(3000);
            //$('.row').trigger('resize');


          },
          //error
          function () {
            $scope.isError = true;

          }

        );
      }
      //$('.row').trigger('resize');
    };




      $scope.$watch('myData', function() {
/*        $scope.colDefs = [];

        angular.forEach(Object.keys($scope.myData[0]), function(key){
          $scope.colDefs.push({ field: key });
        }); */
      }
    );



//    $scope.selectAll = function(){
//      angular.forEach($scope.myData, function(data, index){
//        $scope.gridOptions.selectItem(index, ($scope.msgSelect == 'Select All'));
//      });
//
//
//      if ($scope.msgSelect == 'Select All') {
//        $scope.msgSelect = 'Deselect All';
//      }
//      else {
//
//
//        $scope.msgSelect = 'Select All'
//      }
//    };


    $scope.createOPML = function() {

    };

    // ***************************************************************
    // doAddSource
    // add a source in the DB
    $scope.doAddRss = function () {
      if($scope.model.foundRes != 0 && angular.isDefined($scope.model.mySelections[0])){

        $.each($scope.model.mySelections, function(index, element) {

          $scope.rssAddResult = $scope.addRss.get({
            source_type_s : 'rss',
            type_s :        'source',
            url_s :         this.url,
            tags_ss:        '',
            title_t:        this.title,
            domain_s:       '',
            activity_s:     '',
            //domain_s:       $scope.domain.name,
            //activity_s:     $scope.activity.name,
            refresh_s:      '12h'

          }, function () {

          });

        });
        var modalInstance = $modal.open({
          templateUrl: 'addSourceModal.html',
          controller: ModalInstanceCtrl
        });
      }
      else{
        $scope.isError      = true;
        $scope.errorMessage = 'Merci de sélectionner au moins une source';
      }


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




  });


function sleep(millis, callback) {
  setTimeout(function()
    { callback(); }
    , millis);
}

//https://ajax.googleapis.com/ajax/services/feed/find?v=1.0&q=Official%20Google%20Blog&userip=INSERT-USER-IP"
