'use strict';

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
              $('.row').trigger('resize');


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
