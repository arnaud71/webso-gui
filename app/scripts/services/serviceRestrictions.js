 'use strict';
angular.module('websoApp').factory('serviceRestrictions',function(){
    var restrictions;
    var addRestrictions = function(arrayOfRestrictions){ 
		restrictions = arrayOfRestrictions; 
	}

    return {
        setRestrictions: function(arrayOfRestrictions){
            addRestrictions(arrayOfRestrictions);
        },
        getRestrictions:function(){
            return restrictions;
        }
    };
});