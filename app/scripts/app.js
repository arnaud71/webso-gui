// app.js
var websoApp = angular.module('websoApp', ['ngCookies', 'ngRoute','ui.bootstrap','ngResource','ngSanitize','ngGrid','ui.bootstrap.pagination', 'ui.router']);

websoApp.config(function($stateProvider, $urlRouterProvider) {

'use strict';

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/main.html',
			data: {
				authorizedRoles: ['public']
			}
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
			data: {
				authorizedRoles: ['public']
			}            
        })
        .state('userRegister', {
            url: '/userRegister',
            templateUrl:'views/userRegister.html',
            controller: 'userRegisterCtrl',
            data: {
                authorizedRoles: ['public']
            }
        })
        .state('register', {
            url: '/register',
            templateUrl:'views/register.html',
            controller: 'RegisterCtrl',
			data: {
				authorizedRoles: ['administrateur']
			}
        })
        .state('counts', {
            url: '/counts',
            templateUrl: 'views/counts.html',
            controller: 'UsersCtrl',
			data: {
				authorizedRoles: ['administrateur']
			}
        })
        // VALIDATE
        .state('/validate/add', {
            url: '/validate/add',
            templateUrl: 'views/information/validate.html' ,
            controller : 'AddInformationCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}            
        })
        .state('/validate/display', {
            url: '/validate/display',            
            templateUrl: 'views/information/validationList.html' ,
            controller: 'ValidationListCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
			}                        
        })
        // WATCH
        .state('/watch/add', {
            url: '/watch/add',            
            templateUrl: 'views/watch/watchAdd.html',
            controller:'AddWatchCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/watch/list', {
            url: '/watch/list',            
            templateUrl: 'views/watch/watchList.html',
            controller:'WatchListCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
			}                        
        })
        // SOURCE
        .state('/source/list', {
            url: '/source/list',       
            templateUrl: 'views/source/sourceList.html' ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
			}                        
        })
        .state('/source/add', {
            url: '/source/add',       
            templateUrl: 'views/source/sourceAdd.html' ,
            controller:'AddSourceCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })        
        // PUBLISH
        .state('/publish/newsletter', {
            url: '/publish/newsletter',       
            templateUrl: 'views/report/createNL.html' ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/publish/report', {
            url: '/publish/report',       
            templateUrl: 'views/report/createReport.html' ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        // ORGANIZE
        .state('/organize/survfolder', {
            url: '/organize/survfolder',       
            templateUrl: 'views/organise.html',
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/organize/sourcesfolder', {
            url: '/organize/sourcesfolder',       
            templateUrl: 'views/organise.html' ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/organize/templates', {
            url: '/organize/templates',       
            templateUrl: 'views/organise.html' ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/organize/collect', {
            url: '/organize/collect',       
            templateUrl: 'views/organise.html' ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/organize/profile', {
            url: '/organize/profile',       
            templateUrl: 'views/user/userAdd.html' ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/organize/sources', {
            url: '/organize/sources',                   
            templateUrl: 'views/sources/list.html'  ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/organize/vfolder', {
            url: '/organize/vfolder',       
            templateUrl: 'views/report/reportList.html' ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        // SETTINGS
        .state('/settings/booklet', {
            url: '/settings/booklet',       
            templateUrl: 'views/settings.html' ,
            controller:'',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        // SEARCH
        .state('/search/source', {
            url: '/search/source',       
            templateUrl: 'views/source/sourceList.html',
            controller: 'AddSourceCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
			}                        
        })
        .state('/search/rss', {
            url: '/search/rss',       
            templateUrl: 'views/source/searchNew.html',
            controller: 'GoogleFeedCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
			}                        
        })
        .state('/search/webso', {
            url: '/search/webso',       
            templateUrl: 'views/search/webso.html',
            controller: 'SolrCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
			}                        
        })
        //  Booklet
        .state('/url/:id_url', {
            url: '/url/:id_url',       
            templateUrl: 'views/source/sourceAdd.html',
            controller: 'AddSourceCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/text/:id_text', {
            url: '/text/:id_text',       
            templateUrl: 'views/source/searchNew.html',
            controller: 'GoogleFeedCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/validate/:id_selection', {
            url: '/validate/:id_selection',       
            templateUrl: 'views/information/validate.html',
            controller: 'AddInformationCtrl',
			data: {
				authorizedRoles: ['administrateur', 'veilleur']
			}                        
        })
        .state('/404', {
            url: '/404',       
            templateUrl: '404.html'  
        })
        
        $urlRouterProvider.otherwise('/login');
});


// le run time de l'app est de la façon suivante sur le lien suivant : 
websoApp.run(function ($rootScope, $location, $state, $cookieStore) {
	var username, userRole;
	var arrayContain = function (array, element) {
		var $i = 0;
			while($i < array.length){
				if(array[$i] === element){
					return true;
				}
		$i++;
		}
	return false;
	};

$rootScope.$on('$stateChangeStart', function (event, next) {
	userRole = $cookieStore.get('userRole');
	username = $cookieStore.get('username');
    var authorizedRoles = next.data.authorizedRoles;

	// si l'utilisateur n'est pas connecté 
	if(!username && !userRole){
		// s'il essai d'entrer dans un lien autorisé alors
		if(arrayContain(next.data.authorizedRoles, 'public')){	
			$state.transitionTo('#'+next.url);
			event.preventDefault(); 
		// s'il essai d'entrer dans un lien non autorisé alors
		}else{
			$state.transitionTo('/404');
			event.preventDefault();
		}
	// si l'utilisateur est connecté	
	}else if(username && userRole){
		// s'il essai d'entrer dans un lien autorisé alors
		if(arrayContain(next.data.authorizedRoles, 'public') || arrayContain(next.data.authorizedRoles, userRole)){
			$state.transitionTo('#'+next.url);
			event.preventDefault(); 	
		}else{	
		// s'il essai d'entrer dans un lien non autorisé alors
			$state.transitionTo('/404');
			event.preventDefault();
		}		
	}
 });
});