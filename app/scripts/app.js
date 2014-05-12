'use strict';
// app.js
var websoApp = angular.module('websoApp', ['ngCookies', 'ngRoute','ui.bootstrap','ngResource','ngSanitize','ngGrid','ui.bootstrap.pagination', 'ui.router']);

websoApp.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('/home', {
            url: '/home',
            templateUrl: 'views/main.html',
			data: {
				authorizedRoles: ['public']
			}
        })
        .state('/login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
			data: {
				authorizedRoles: ['public']
			}            
        })
        .state('/publicRegister', {
            url: '/publicRegister',
            templateUrl:'views/publicRegister.html',
            controller: 'publicRegisterCtrl',
            data: {
                authorizedRoles: ['public']
            }
        })
        .state('/administratorRegister', {
            url: '/administratorRegister',
            templateUrl:'views/administratorRegisterCtrl',
            controller: 'administratorRegisterCtrl',
			data: {
				authorizedRoles: ['administrateur']
			}
        })
        .state('/counts', {
            url: '/counts',
            templateUrl: 'views/counts.html',
            controller: 'UsersCtrl',
			data: {
				authorizedRoles: ['administrateur']
			}
        })
        .state('/deconnexion', {
            url: '/deconnexion',
            data: {
                authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
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
        
        $urlRouterProvider.otherwise('/home');
});

// le run time de l'app est de la façon suivante : 
websoApp.run(function ($window, $rootScope, $location, $state, $cookieStore, serviceRestrictions) {
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

    var calculRestriction = function(userRole, username){
        var booleansRestrictions = [];
        var isPublicNotAuthenticated, isLecteurVeilleurAdmin, isVeilleurAdmin, isAdmin;

        if(!userRole && !username){
            isLecteurVeilleurAdmin = false;
            isPublicNotAuthenticated = true;
        }else if(userRole && username){
            isLecteurVeilleurAdmin = true;
            isPublicNotAuthenticated = false;
            if(userRole === 'administrateur'){
                isVeilleurAdmin = true;
                isAdmin = true;
            }else if(userRole === 'lecteur'){
                isVeilleurAdmin = false;
                isAdmin = false;
            }else if(userRole === 'veilleur'){
                isVeilleurAdmin = true;
                isAdmin = false;
            }
        }

        booleansRestrictions[0] = isLecteurVeilleurAdmin;
        booleansRestrictions[1] = isVeilleurAdmin;
        booleansRestrictions[2] = isAdmin;
        booleansRestrictions[3] = isPublicNotAuthenticated;


        return booleansRestrictions;
    };

$rootScope.$on('$stateChangeStart', function (event, next) {   
	userRole = $cookieStore.get('userRole');
	username = $cookieStore.get('username');
    var arrayOfrestrictions = calculRestriction(userRole, username);
    serviceRestrictions.setRestrictions(arrayOfrestrictions);
    var authorizedRoles = next.data.authorizedRoles;

	// si l'utilisateur n'est pas connecté 
	if(!username && !userRole){
		// s'il essai d'entrer dans un lien autorisé alors
		if(arrayContain(next.data.authorizedRoles, 'public')){	
			$location.path(next.url);
		// s'il essai d'entrer dans un lien non autorisé alors
		}else{
			$location.path('/404');
		}
	// si l'utilisateur est connecté	
	}else if(username && userRole){ 
		// s'il essai d'entrer dans un lien autorisé alors
		if(arrayContain(next.data.authorizedRoles, 'public') || arrayContain(next.data.authorizedRoles, userRole)){
			$location.path(next.url);
		}else{	
		// s'il essai d'entrer dans un lien non autorisé alors
			$location.path('/404');
		}	
	}
 });
});
