 'use strict';

websoApp.factory('serviceDashboard',function(){
    var haveElements;
    var notHaveElements;
    return {
        haveWidgetOnDash : function(){
            return haveElements;
        },
        setBooleanHaveWidgetOnDash : function(bool){
            haveElements = bool;
        },
        notHaveWidgetsOnDash : function(){
            return notHaveElements;
        },
        setBooleanNotHaveWidgetOnDash : function(bool){
            notHaveElements = bool;
        }
    };
});