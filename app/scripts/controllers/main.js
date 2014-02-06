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
        $scope.msgSelect = 'Select All';
        $scope.mySelections = [];
        $scope.foundRes = 0;
        $scope.nameController = 'GoogleFeedCtrl';
        $scope.googleFeed = $resource('https://ajax.googleapis.com/ajax/services/feed/:action',
            {action:'find', v:'1.0',q:'technology', callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


//        $scope.myData = [{name: "Moroni", age: 50},
//            {name: "Tiancum", age: 43},
//            {name: "Jacob", age: 27},
//            {name: "Nephi", age: 29},
//            {name: "Enos", age: 34}];
//
        $scope.gridOptions = {
            data: 'myData',
            //selectWithCheckboxOnly: 'true',
            selectedItems: $scope.mySelections,
            columnDefs: [

                {field:'url', displayName: 'Source', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },
                {field:'title', displayName:'Title', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {field:'link', displayName: 'From', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },

            ]
        };


        $scope.doSearch = function () {
            if ($scope.searchTerm) {
                $scope.googleFeedResult = $scope.googleFeed.get(
                    {q:$scope.searchTerm},
                    function() {        //call back function for asynchronous
                        //$scope.foundRes = $scope.googleFeedResult.responseData.entries.length;
                        //var myData =  $.parseJSON(JSON.parse($scope.googleFeedResult.responseData.entries));
                        //$scope.myData  =  myData;
                        if (typeof $scope.googleFeedResult.responseData === "undefined") {}
                        else {
                            $scope.myData = $scope.googleFeedResult.responseData.entries;
                            $scope.foundRes = $scope.googleFeedResult.responseData.entries.length;
                        }
                        //$scope.gridOptions = { data : 'myData' };
                        //$scope.myData = [{"url":"http://rssfeeds.webmd.com/rss/rss.aspx?RSSSource\u003dRSS_PUBLIC","title":"\u003cb\u003eAsthma\u003c/b\u003e and \u003cb\u003eAsthma\u003c/b\u003e Attacks Center: Symptoms, Causes, Tests, and \u003cb\u003e...\u003c/b\u003e","contentSnippet":"\u003cb\u003eAsthma\u003c/b\u003e (reactive airway disease) affects an estimated 34 million people in the \u003cbr\u003e  U.S. Find in-depth \u003cb\u003easthma\u003c/b\u003e information, including treatments, triggers, and\u0026nbsp;\u003cb\u003e...\u003c/b\u003e","link":"http://www.webmd.com/asthma/default.htm"},{"url":"http://www.nlm.nih.gov/medlineplus/feeds/topics/asthma.xml","title":"\u003cb\u003eAsthma\u003c/b\u003e: MedlinePlus","contentSnippet":"\u003cb\u003eAsthma\u003c/b\u003e is a chronic disease that affects your airways. Your airways are tubes that \u003cbr\u003e  carry air in and out of your lungs. If you have \u003cb\u003easthma\u003c/b\u003e, the inside walls of your\u0026nbsp;\u003cb\u003e...\u003c/b\u003e","link":"http://www.nlm.nih.gov/medlineplus/asthma.html"},{"url":"http://www.nlm.nih.gov/medlineplus/feeds/topics/asthmainchildren.xml","title":"\u003cb\u003eAsthma\u003c/b\u003e in Children: MedlinePlus","contentSnippet":"\u003cb\u003eAsthma\u003c/b\u003e is a chronic disease that affects your airways. Your airways are tubes that \u003cbr\u003e  carry air in and out of your lungs. If you have \u003cb\u003easthma\u003c/b\u003e, the inside walls of your\u0026nbsp;\u003cb\u003e...\u003c/b\u003e","link":"http://www.nlm.nih.gov/medlineplus/asthmainchildren.html"},{"url":"http://yosemite.epa.gov/opa/admpress.nsf/RSSRecentNews","title":"\u003cb\u003eAsthma\u003c/b\u003e Home | Indoor Air | US EPA","contentSnippet":"EPA\u0026#39;s Coordinated Approach on \u003cb\u003eAsthma\u003c/b\u003e EPA promotes scientific understanding \u003cbr\u003e  of environmental \u003cb\u003easthma\u003c/b\u003e triggers and ways to manage \u003cb\u003easthma\u003c/b\u003e in community\u0026nbsp;\u003cb\u003e...\u003c/b\u003e","link":"http://www.epa.gov/asthma/"},{"url":"http://www.news-medical.net/syndication.axd?format\u003drss","title":"\u003cb\u003eAsthma\u003c/b\u003e - from News-Medical.Net","contentSnippet":"\u003cb\u003eAsthma\u003c/b\u003e is a disease that affects your lungs. It is the most common long-term \u003cbr\u003e  disease of children, but adults have \u003cb\u003easthma\u003c/b\u003e, too. \u003cb\u003eAsthma\u003c/b\u003e causes repeated \u003cbr\u003e  episodes\u0026nbsp;\u003cb\u003e...\u003c/b\u003e","link":"http://www.news-medical.net/health/Asthma.aspx"},{"url":"http://www.health.com/health/asthma/feed","title":"\u003cb\u003eAsthma\u003c/b\u003e Condition Center - Health.com","contentSnippet":"\u003cb\u003eAsthma\u003c/b\u003e is a lung condition that affects 23 million Americans, including 6 million \u003cbr\u003e  kids. People with \u003cb\u003easthma\u003c/b\u003e may cough, wheeze, or have trouble breathing.","link":"http://www.health.com/health/asthma/"},{"url":"http://www.medicinenet.com/rss/dailyhealth.xml","title":"\u003cb\u003eAsthma\u003c/b\u003e Symptoms, Relief Therapies, Treatment and Medications on \u003cb\u003e...\u003c/b\u003e","contentSnippet":"Medical information about \u003cb\u003easthma\u003c/b\u003e symptoms and relief therapies: doctor \u003cbr\u003e  produced and written for patients experiencing \u003cb\u003easthma\u003c/b\u003e related conditions to \u003cbr\u003e  make\u0026nbsp;\u003cb\u003e...\u003c/b\u003e","link":"http://www.medicinenet.com/asthma/focus.htm"},{"url":"http://www.medicalnewstoday.com/rss/asthma-respiratory.xml","title":"Respiratory News \u0026amp; \u003cb\u003eAsthma\u003c/b\u003e News from Medical News Today","contentSnippet":"The latest respiratory, \u003cb\u003easthma\u003c/b\u003e news headlines published daily.","link":"http://www.medicalnewstoday.com/sections/asthma-respiratory/"},{"url":"http://rss.cnn.com/rss/cnn_health.rss","title":"Survive the September \u003cb\u003easthma\u003c/b\u003e \u0026#39;epidemic\u0026#39; - CNN.com","contentSnippet":"Sep 5, 2013 \u003cb\u003e...\u003c/b\u003e Many parents don\u0026#39;t realize that the worst \u003cb\u003easthma\u003c/b\u003e day of the year actually occurs \u003cbr\u003e  in September.","link":"http://www.cnn.com/2013/09/05/health/asthma-school-reinhardt/index.html"},{"url":"http://www.sciencedaily.com/rss/health_medicine/asthma.xml","title":"ScienceDaily: \u003cb\u003eAsthma\u003c/b\u003e News","contentSnippet":"What is \u003cb\u003easthma\u003c/b\u003e? What are the causes and symptoms of \u003cb\u003easthma\u003c/b\u003e and \u003cb\u003easthmatic\u003c/b\u003e \u003cbr\u003e  bronchitis? Find the latest research and information on \u003cb\u003easthma\u003c/b\u003e attacks, treatment\u003cbr\u003e  \u0026nbsp;\u003cb\u003e...\u003c/b\u003e","link":"http://www.sciencedaily.com/news/health_medicine/asthma/"}];



                    }

                );
            }
        };

        $scope.selectAll = function(){
            angular.forEach($scope.myData, function(data, index){
                $scope.gridOptions.selectItem(index, ($scope.msgSelect == 'Select All'));
            });


            if ($scope.msgSelect == 'Select All') {
                $scope.msgSelect = 'Deselect All';
            }
            else {


                $scope.msgSelect = 'Select All'
            }
        };


        $scope.createOPML = function() {

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

    $scope.domains =  [
        {name:'domaine 1'},
        {name:'domaine 2'},
        {name:'domaine 3'}
    ] ;
    $scope.domain = $scope.domains[2];

    $scope.activities =  [
        {name:'Secteur dactivité 1'},
        {name:'Secteur dactivité 2'},
        {name:'Secteur dactivité 3'}
    ] ;
    $scope.activity = $scope.activities[2];

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

