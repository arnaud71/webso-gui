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
            templateUrl: 'views/information/validate.html' ,
            controller : 'AddInformationCtrl'
        })
        .when('/validate/display', {
            templateUrl: 'views/information/validationList.html' ,
            controller: 'ValidationListCtrl'
        })
        .when('/watch/add', {
            templateUrl: 'views/watch/watchAdd.html',
            controller:'AddWatchCtrl'
        })
        .when('/watch/sourceslist', {
            templateUrl: 'views/source/list.html'
        })

        .when('/source/sourcesList', {
          templateUrl: 'views/source/sourceList.html'
        })

        .when('/watch/watchList', {
            templateUrl: 'views/watch/watchList.html',
            controller:'WatchListCtrl'
        })
        .when('/publish/newsletter', {
            templateUrl: 'views/report/createNL.html'
        })
        .when('/publish/report', {
            templateUrl: 'views/report/createReport.html'
        })
        .when('/organize/survfolder', {
            templateUrl: 'views/organise.html'

        })
        .when('/organize/sourcesfolder', {
            templateUrl: 'views/organise.html'

        })
        .when('/organize/templates', {
            templateUrl: 'views/organise.html'

        })
        .when('/organize/collect', {
            templateUrl: 'views/organise.html'

        })
        .when('/organize/profile', {
            templateUrl: 'views/user/userAdd.html'

        })
        .when('/organize/sources', {
            templateUrl: 'views/sources/list.html'

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
        .when('/search/source', {
          templateUrl: 'views/source/sourceList.html'

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
        .when('/source/sourceAdd', {
            templateUrl: 'views/source/sourceAdd.html' ,
            controller:'AddSourceCtrl'

        })

      .when('/search/webso', {
        templateUrl: 'views/search/webso.html',
        controller: 'SolrCtrl'

      })

        .otherwise({
        redirectTo: '/'
      });
  }]);





