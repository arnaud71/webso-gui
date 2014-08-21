/*
------------------
Widgets's services
------------------
*/
'use strict';
angular.module('websoApp').factory('serviceWidgets',function($cookieStore, dashboard){

	// give a title to a widget
	function giveTitleToWidget(widget){
	    var title;
	    switch (widget) {
	        case 'affichageCollectesMultisources':
	            title = 'Collectes multisources';
	            break;
	        case 'affichageDossiersSurveillance':
	            title = 'Dossiers de surveillances';
	            break;
	        case 'affichageDossiersValidation':
	            title = 'Dossiers de validation';
	            break;
	        case 'affichageFluxTwitter':
	            title = 'Flux twitter';
	            break;
	        case 'affichageSource':
	            title = 'Sources';
	            break;
	        case 'affichageSurveillance':
	            title = 'Surveillances';
	            break;
	        case 'defaultWidget':
	            title = 'widget par defaut';
	            break;
	    }
	    return title;
	}

	// get a current user's login
	function getUserCookies(){
		var informations = [];
		informations[0] = $cookieStore.get('username');
		informations[1] = $cookieStore.get('userRole');
		return informations;
	}

    // create a widget's configuration
    function createConfiguration(type){
      var cfg = {};
      var config = dashboard.widgets[type].config;
      if (config){
        cfg = angular.copy(config);
      }
      return cfg;
    }

	// function that calculates the maximum number of widgets on each column
	function nbWidgetsMaxInWichColumn(nbWidgets){
	  var array = [], $i;
	  var div = Math.floor(nbWidgets/3);
	  var mod = nbWidgets % 3;
	  if(mod === 0){
	    for($i = 0; $i < 3; $i++)
	      array[$i] = div;
	  }else {
	    if(mod === 1){
	        array[0] = div + 1;
	        array[1] = div;
	        array[2] = div;
	    } else {
	        if(mod === 2){
	          array[0] = div + 1;
	          array[1] = div + 1;
	          array[2] = div;
	        }
	    }
	  }
	  return array;
	}

    return {
        getTitleWidget:function(widget){
            return giveTitleToWidget(widget);
        },
        getIdWidget:function(widgets){
        	return giveIdToWidget(widgets);
        },
        getUserIdents:function(){
        	return getUserCookies();
        },
        getWidgetConfiguration:function(type){
        	return createConfiguration(type);
        },
        getNbWidgetsMaxInWichColumn:function(nbWidgets){
        	return nbWidgetsMaxInWichColumn(nbWidgets);
        }
    };
});