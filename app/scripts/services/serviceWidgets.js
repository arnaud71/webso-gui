 'use strict';
angular.module('websoApp').factory('serviceWidgets',function($cookieStore){
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
	    }
	    return title;
	}

	function giveIdToWidget(widgets){
		if(widgets.length === 0){
			return 1;
		}else{
			return parseInt(widgets[widgets.length - 1].id) + 1;
		}
	}
  
	function getUserCookies(){
		var informations = [];
		informations[0] = $cookieStore.get('username');
		informations[1] = $cookieStore.get('userRole');
		return informations;
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
        }
    };
});