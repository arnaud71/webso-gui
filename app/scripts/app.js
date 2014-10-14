'use strict';
// app.js
var websoApp = angular.module('websoApp', ['sample.widgets.affichageSource', 'sample.widgets.affichageSurveillance', 
    'sample.widgets.affichageDossiersValidation','sample.widgets.affichageDossiersSurveillance',
    'sample.widgets.affichageCollectesMultisources','sample.widgets.affichageFluxTwitter',
    'sample.widgets.defaultWidget', 'adf', 'checklist-model', 'ngCookies',
    'ngRoute','ui.bootstrap','ngResource','ngSanitize','ngGrid','ui.bootstrap.pagination', 'ui.router',
    'LocalStorageModule', 'ui.tree', 'xeditable','ui.select','angulartics', 'angulartics.google.analytics',
    'angulartics.piwik','angular-loading-bar', 'ngAnimate']);

websoApp.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider

        // HPME
        .state('/home', {
            url: '/home',
            templateUrl: 'views/main.html',
                  data: {
                      authorizedRoles: ['public']
                  }
        })
        // LINKS WHEN LOGOUT
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
        /*
        .state('/administratorRegister', {
            url: '/administratorRegister',
            templateUrl:'views/administratorRegister.html',
            controller: 'administratorRegisterCtrl',
                  data: {
                      authorizedRoles: ['administrateur']
                  }
        })*/
        // LOGOUT
        .state('/deconnexion', {
            url: '/deconnexion',
            data: {
                authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
            }
        })

        // COLLECT
        .state('/collect/external', {
            url: '/collect/external',       
            templateUrl: 'views/collect/external.html' ,
            controller:'',
                  data: {
                      authorizedRoles: ['administrateur', 'veilleur']
                  }
        })
        .state('/collect/rss', {
            url: '/collect/rss',       
            templateUrl: 'views/collect/rss.html' ,
            controller:'',
                  data: {
                      authorizedRoles: ['administrateur', 'veilleur']
                  }
        })
        .state('/collect/package', {
          url: '/collect/package',
          templateUrl: 'views/collect/package.html' ,
          controller:'',
          data: {
            authorizedRoles: ['administrateur', 'veilleur']
          }
        })

        // SEARCH
        .state('/search/source', {
            url: '/search/source',
            templateUrl: 'views/search/sources.html',
            controller: 'FolderSearchCtrl',
            data: {
              authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
            }
        })
        .state('/search/rss', {
            url: '/search/rss',       
            templateUrl: 'views/search/searchNew.html',
            controller: 'GoogleFeedCtrl',
                  data: {
                      authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
                  }
        })
        .state('/search/webso', {
            url: '/search/webso',
            templateUrl: 'views/search/folder.html',
            controller: 'FolderSearchCtrl',
                  data: {
                      authorizedRoles: ['administrateur', 'veilleur', 'lecteur']
                  }
        })
        .state('/search/folder', {
            url: '/search/folder',
            templateUrl: 'views/search/folder.html',
            controller: 'FolderSearchCtrl',
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

        // DASHBOARD
        .state('/dashboard', {
            url: '/dashboard',       
            templateUrl: 'views/dashboard.html' ,
            controller:'dashboardCtrl',
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
        .state('/organize/wfolder', {
          url: '/organize/wfolder',
          templateUrl: 'views/organize/wfolder.html' ,
          controller:'',
          data: {
            authorizedRoles: ['administrateur', 'veilleur']
          }
        })
        .state('/organize/vfolder', {
            url: '/organize/vfolder',       
            templateUrl: 'views/organize/vfolder.html' ,
            controller:'',
                  data: {
                      authorizedRoles: ['administrateur', 'veilleur']
                  }
        })
        .state('/organize/templates', {
            url: '/organize/templates',       
            templateUrl: 'views/organize/template.html' ,
            controller:'',
                  data: {
                      authorizedRoles: ['administrateur', 'veilleur']
                  }
        })
        // .state('/organize/collect', {
        //     url: '/organize/collect',       
        //     templateUrl: 'views/organise.html' ,
        //     controller:'',
        //           data: {
        //               authorizedRoles: ['administrateur', 'veilleur']
        //           }
        // })
        .state('/organize/profile', {
            url: '/organize/profile',
            templateUrl: 'views/organize/profile.html' ,
            controller:'',
                    data: {
                      authorizedRoles: ['administrateur', 'veilleur']
                  }
        })
        .state('/organize/booklet', {
            url: '/organize/booklet',       
            templateUrl: 'views/oragnize/settings.html' ,
            controller:'',
                    data: {
                      authorizedRoles: ['administrateur', 'veilleur']
                  }
        })
        .state('/usersList', {
            url: '/usersList',
            templateUrl: 'views/administration/usersList.html',
            controller: 'UsersListCtrl',
                  data: {
                      authorizedRoles: ['administrateur']
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
            templateUrl: 'views/collect/searchNew.html',
            controller: 'GoogleFeedCtrl',
                  data: {
                      authorizedRoles: ['administrateur', 'veilleur']
                  }
        })

        // ERREUR
        .state('/404', {
            url: '/404',       
            templateUrl: '404.html'  
        })
        
        $urlRouterProvider.otherwise('/home');
});

websoApp.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'bootstrap';
});


// le run time de l'app est de la façon suivante : 
websoApp.run(function ($rootScope, $location, $cookieStore, serviceRestrictions) {
  //editableOptions.theme = 'bs3';
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

    var calculRestriction = function(username, userRole){
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

  // function who gets the "username" and the "userRole" of the current user
  var getUserCookies = function(){
    var informations = [];
    informations[0] = $cookieStore.get('username');
    informations[1] = $cookieStore.get('userRole');
    return informations;
  };

$rootScope.$on('$stateChangeStart', function (event, next) {
    // get the user's informations
    var userInformations = getUserCookies();

    // calculate restrictions on features compared to the role of the user
    var arrayOfrestrictions = calculRestriction(userInformations[0], userInformations[1]);
    serviceRestrictions.setRestrictions(arrayOfrestrictions);
    var authorizedRoles = next.data.authorizedRoles;

    // if the user is not connected
    if((!userInformations[0]) && (!userInformations[1])){
        // if he tries to enter an authorized link then
        if(arrayContain(next.data.authorizedRoles, 'public')){  
            $location.path(next.url);
        // if he tries to enter an unauthorized link then
        }else{
            $location.path('/404');
        }
    // if the user is connected  
    }else if(userInformations[0] && userInformations[1]){ 
        // if he tries to enter an authorized link then
        if(arrayContain(next.data.authorizedRoles, 'public') || arrayContain(next.data.authorizedRoles, userInformations[1])){
            $location.path(next.url);
        }else{  
        // if he tries to enter an unauthorized link then
            $location.path('/404');
        }   
    }
 });
});
