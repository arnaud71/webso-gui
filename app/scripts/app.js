'use strict';

angular.module('websoApp', ['ui.bootstrap','ngResource','ngSanitize','ngGrid'])
  .config(function ($routeProvider) {
    $routeProvider
        /*
        Menu
         */
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'SolrCtrl'
        })
        .when('/home', {
            templateUrl: 'views/main.html'

        })
        .when('/search', {
            templateUrl: 'views/main.html',  // main.html --> dans solr // search.html --> dans google feed
            controller: 'SolrCtrl'

        })
        .when('/validate/add', {
            templateUrl: 'views/information/validate.html'
        })
        .when('/validate/display', {
            templateUrl: 'views/information/validationList.html'
        })
        .when('/watch/add', {
            templateUrl: 'views/surveillance/addSurveillance.html'
        })
        .when('/watch/sourceslist', {
            templateUrl: 'views/source/list.html'
        })
        .when('/watch/surveillanceList', {
            templateUrl: 'views/information/surveillanceList.html'
        })
        .when('/publish/newsletter', {
            templateUrl: 'views/report/createNL.html'
        })
        .when('/publish/report', {
            templateUrl: 'views/report/createReport.html'
        })
        .when('/organise/survfolder', {
            templateUrl: 'views/organise.html'

        })
        .when('/organise/sourcesfolder', {
            templateUrl: 'views/organise.html'

        })
        .when('/organise/templates', {
            templateUrl: 'views/organise.html'

        })
        .when('/organise/collect', {
            templateUrl: 'views/organise.html'

        })
        .when('/organize/profile', {
            templateUrl: 'views/user/userAdd.html'

        })
        .when('/organise/sources', {
            templateUrl: 'views/organize/organize.html'

        })
         .when('/organize/vfolder', {
            templateUrl: 'views/report/reportList.html'

        })

        .when('/signin', {
            templateUrl: 'views/signin.html'

        })
        .when('/search/rss', {
            templateUrl: 'views/source/searchNew.html'

        })
        /*
          Booklet
         */
        .when('/url/:id_url', {
            templateUrl: 'views/source/formAdd.html',
            controller: 'BarletCtrl'
        })

        .when('/text/:id_text', {
            templateUrl: 'views/source/searchNew.html',
            controller: 'BarletCtrl'
        })
        .when('/validate/:id_selection', {
            templateUrl: 'views/validate.html',
            controller: 'BarletCtrl'
        })


        /*
        Duplicates ? to check
         */
        .when('/source/searchNew', {
            templateUrl: 'views/source/searchNew.html',
            controller: 'GoogleFeedCtrl'

        })
        .when('/source/list', {
            templateUrl: 'views/source/list.html',
            controller: 'SourceDataCtrl'

        })
        .when('/source/formAdd', {
            templateUrl: 'views/source/formAdd.html'

        })

        .otherwise({
        redirectTo: '/'
      });
  });





