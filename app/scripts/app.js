'use strict';

angular.module('websoApp', ['ngRoute','ui.bootstrap','ngResource','ngSanitize','ngGrid','ui.bootstrap.pagination']);

angular.module('websoApp')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        /*
        Menu
         */
        .when('/', {
            templateUrl: 'views/comingsoon.html',
            controller:''
        })
        .when('/home', {
            templateUrl: 'views/main.html',
            controller:''

        })


        // VALIDATE
        .when('/validate/add', {
            templateUrl: 'views/information/validate.html' ,
            controller : 'AddInformationCtrl'
        })
        .when('/validate/display', {
            templateUrl: 'views/information/validationList.html' ,
            controller: 'ValidationListCtrl'
        })


        // WATCH
        .when('/watch/add', {
            templateUrl: 'views/watch/watchAdd.html',
            controller:'AddWatchCtrl'
        })
        .when('/watch/list', {
          templateUrl: 'views/watch/watchList.html',
          controller:'WatchListCtrl'
        })

        // SOURCE
        .when('/source/list', {
          templateUrl: 'views/source/sourceList.html' ,
            controller:''
        })

        .when('/source/add', {
          templateUrl: 'views/source/sourceAdd.html' ,
          controller:'AddSourceCtrl'

        })

        // PUBLISH
        .when('/publish/newsletter', {
            templateUrl: 'views/report/createNL.html' ,
            controller:''
        })
        .when('/publish/report', {
            templateUrl: 'views/report/createReport.html' ,
            controller:''
        })

        // ORGANIZE
        .when('/organize/survfolder', {
            templateUrl: 'views/organise.html',
            controller:''

        })
        .when('/organize/sourcesfolder', {
            templateUrl: 'views/organise.html' ,
            controller:''

        })
        .when('/organize/templates', {
            templateUrl: 'views/organise.html' ,
            controller:''

        })
        .when('/organize/collect', {
            templateUrl: 'views/organise.html' ,
            controller:''

        })
        .when('/organize/profile', {
            templateUrl: 'views/user/userAdd.html' ,
            controller:''

        })
        .when('/organize/sources', {
            templateUrl: 'views/sources/list.html'  ,
            controller:''

        })
        .when('/organize/vfolder', {
            templateUrl: 'views/report/reportList.html' ,
            controller:''

        })

        .when('/signin', {
            templateUrl: 'views/signin.html'  ,
            controller:''

        })

        // SETTINGS
        .when('/settings/booklet', {
          templateUrl: 'views/settings.html' ,
            controller:''

        })

        // SEARCH

        .when('/search/source', {
          templateUrl: 'views/source/sourceList.html',
          controller: 'AddSourceCtrl'
        })

        .when('/search/rss', {
          templateUrl: 'views/source/searchNew.html',
          controller: 'GoogleFeedCtrl'
        })

        .when('/search/webso', {
          templateUrl: 'views/search/webso.html',
          controller: 'SolrCtrl'

        })

      /*
        Booklet
       */

        .when('/url/:id_url', {
            templateUrl: 'views/source/sourceAdd.html',
            controller: 'AddSourceCtrl'
        })

        .when('/text/:id_text', {
            templateUrl: 'views/source/searchNew.html',
            controller: 'GoogleFeedCtrl'
        })
        .when('/validate/:id_selection', {
            templateUrl: 'views/information/validate.html',
            controller: 'AddInformationCtrl'
        })








        .otherwise({
        redirectTo: '/'
      });
  }]);





