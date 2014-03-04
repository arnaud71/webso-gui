'use strict';





angular.module('websoApp')
  .controller('AddSourceCtrl', function ($scope,$resource) {

    $scope.inputType    = 'rss';
    $scope.inputRefresh = 1440; // per day
    $scope.inputLevel   = 0;
    $scope.inputUser    = 'user_1';

    $scope.sourceAdd = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',     //'http://albator.hesge.ch/cgi-bin/webso/sources/:action'
      {action:'put.json', source_user:'user_1' ,source_url:'',source_type:'source',source_level_sharing:'0',callback:"JSON_CALLBACK"},
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


/*
 Bookmarklet -  controller
 */
angular.module('websoApp')
  .controller('BarletCtrl', function ($scope,$routeParams) {
    $scope.textArg = 'rien';
    $scope.inputUrl ="";
    $scope.searchTerm ="";

    if ($routeParams.id_url) {
      $scope.textArg = unescape(atob(decodeURIComponent($routeParams.id_url)));
      $scope.inputUrl = $scope.textArg;
    }

    if ($routeParams.id_text) {
      $scope.textArg = $routeParams.id_text;
      $scope.searchTerm = $scope.textArg;
    }

    if ($routeParams.id_selection) {
      $scope.textArg = unescape(atob(decodeURIComponent($routeParams.id_selection)));
      $scope.inputUrl = $scope.textArg;
    }
  });

/*
 Newsletter form controller
 */
angular.module('websoApp')
  .controller('NLCtrl', function($scope){

    /*
     emails list
     */
    $scope.emails = [
      {Name: "test1@mail.com"},
      {Name: "test2@mail.com"}
    ];
    /*
     Add an email to the list
     */
    $scope.addItem = function(email) {
      $scope.emails.push(email);
      $scope.email = {};
    }
    /*
     Remove an email from the list
     */
    $scope.removeItem = function(index){
      $scope.emails.splice(index,1);
    }


  });

/*
 Date picker controller
 */
angular.module('websoApp')
  .controller ("DatepickerCtrl", function ($scope, $timeout) {


  $scope.freq = "1 semaine";

  $scope.options = {
    freq: ["1 jour", "1 semaine", "1 mois"]
  };


  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

});



/*
 Report form controller
 */
angular.module('websoApp')
  .controller('reportCtrl', function($scope,$resource){
    $scope.format = "";
    $scope.template ="";
    $scope.options = {
      format: ["html"],
      template: ["template 1"]
    };
    $scope.inputTitle = '';
    $scope.reportAdd = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
      {action:'put_Report.json', source_user:'user_1' ,report_title:'title test',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});
    $scope.doAdd = function () {
      $scope.reportAddResult = $scope.reportAdd.get({
        report_title:     $scope.inputTitle
      });
    };
  });

/*
 Controllers under construction pop-up
 */
angular.module('websoApp')
  .controller('UnderconstructionCtrl',function ($scope, $modal, $log) {

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'underconstruction.html',
        controller: ModalInstanceCtrl

      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  });

/*
 Controllers for "information added" popup
 */
angular.module('websoApp')
  .controller('informationOkCtrl',function ($scope, $modal, $log) {

    $scope.open = function () {

      var modalInstance = $modal.open({
        templateUrl: 'informationOk.html',
        controller: ModalInstanceCtrl

      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  });

var ModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.close = function () {
    $modalInstance.dismiss('Fermer');
  };
};



/*
 Not used or tested yet
 */
angular.module('websoApp')
  .controller("treeCtrl", function($scope){
    $scope.delete = function(data) {
      data.nodes = [];
    };
    $scope.add = function(data) {
      var post = data.nodes.length + 1;
      var newName = data.name + '-' + post;
      data.nodes.push({name: newName,nodes: []});
    };
    $scope.tree = [{name: "Node", nodes: []}];
  });


/*
 Accordion controller
 */

angular.module('websoApp')
  .controller('AccordionDemoCtrl', function($scope){

    /*
     $scope.groups = [
     {
     title: "Dynamic Group Header - 1",
     content: "Dynamic Group Body - 1"
     },
     {
     title: "Dynamic Group Header - 2",
     content: "Dynamic Group Body - 2"
     }
     ];
     */
    $scope.addItem = function() {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

  });


/*
 get validated information
 */

angular.module('websoApp')
  .controller('displayValidatedInfosCtrl', function ($scope,$resource) {

    $scope.informationData = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
      {action:'get_Information.json', source_user:'user_2',information_url:'*',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.doSearch = function () {
      $scope.informationResult = $scope.informationData.get();
    };
    $scope.doSearch();
  });

/*
 Display list of reports (validation reports)
 */
angular.module('websoApp')
  .controller('displayReportCtrl', function ($scope,$resource) {
    $scope.reportData = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
      {action:'get_Report.json', source_user:'user_1',report_title:'*',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.doSearch = function () {
      $scope.reportResult = $scope.reportData.get();

    };
    $scope.doSearch();
  });

/*
 get surveillance list
 */

angular.module('websoApp')
  .controller('displaySurveillanceCtrl', function ($scope,$resource) {

    $scope.surveillanceData = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
      {action:'get_Surveillance.json', source_user:'user_1',surveillance_url:'*',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.doSearch = function () {
      $scope.surveillanceResult = $scope.surveillanceData.get();

    };
    $scope.doSearch();
  });


/*
 get validated data from json file
 */

angular.module('websoApp')
  .controller('getValidatedDataCtrl', function ($scope,$http) {
    $http.get('/data/example.json').success(function(data) {
      $scope.pages = data;

    });

  });


/*
 Listes déroulantes
 */
angular.module('websoApp')
  .controller ("menuCtrl", function ($scope) {
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
    $scope.folderName =  [
        {name:'Dossier 1'},
        {name:'Dossier 2'},
        {name:'Dossier 3'}
    ] ;
    $scope.folder = $scope.folderName[2];

  /*
    Notifications menu
   */
    $scope.notifications =  [
        {name:'Pas de notification'},
        {name:'email'}

    ] ;
    $scope.notification = $scope.notifications[0];

});


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


    $scope.informationAdd = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',//'http://localhost/cgi-bin/webso-services-master/sources/:action',
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

/*
 Add surveillance controller
 */

angular.module('websoApp')
  .controller('addSurvCtrl', function ($scope,$resource) {

    $scope.inputType    = 'rss';
    $scope.inputLevel   = 0;
    $scope.inputUser    = 'user_1';
    $scope.inputUrl     ='';
    $scope.inputTitle   = '';
    $scope.inputDetail = '';
    $scope.inputComment= '';
    $scope.inputRefresh = 1440; // per day

    $scope.inputTitle = ''; // per day
    $scope.inputTag = ''; // per day
    $scope.inputDomain = ''; // per day
    $scope.inputActivity = ''; // per day
    $scope.inputFrequency = ''; // per day


    $scope.surveillanceAdd = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
      {action:'put_Surveillance.json',surveillance_url:'http://en.wikipedia.org/wiki/Global_warming',source_user:'user_1',surveillance_type:'surveillance',surveillance_title:'',surveillance_tag:'',surveillance_domain:'',surveillance_activity:'',surveillance_frequency:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.doAdd = function () {

      $scope.surveillanceAddResult = $scope.surveillanceAdd.get({
        surveillance_title:     $scope.inputTitle,
        surveillance_tag:    $scope.inputTag,
        surveillance_domain:    $scope.inputDomain,
        surveillance_activity:   $scope.inputActivity,
        surveillance_frequency:   $scope.inputFrequency

      });
    };




  });

angular.module('websoApp')
  .controller ("ngCkeditor", function ($scope) {
  // setup editor options
  $scope.editorOptions = {
    language: 'ru'  ,
    uiColor: '#000000'
  };


});

