'use strict';

websoApp.config(function(dashboardProvider){
  
  dashboardProvider
    // 1 line : 2 columns with 6 of size
    .structure('6-6', {
      rows: [{
        columns: [{
          styleClass: 'col-md-6'
        }, {
          styleClass: 'col-md-6'
        }]
      }]
    })
    // 1 line : 3 colums with 6 of size
    .structure('4-4-4', {
      rows: [{
        columns: [{
          styleClass: 'col-md-4',
          widgets: []
        }, {
          styleClass: 'col-md-4',
          widgets: []
        },{
          styleClass: 'col-md-4',
          widgets: []
        }]
      }]
    })
    // 2 lines :
      // the first line : 	1 column with 12 of size
      // the second line : 	3 column with 4 of size
    .structure('12/4-4-4', {
      rows: [{
        columns: [{
          styleClass: 'col-md-12'
        }]
      }, {
        columns: [{
          styleClass: 'col-md-4'
        }, {
          styleClass: 'col-md-4'
        }, {
          styleClass: 'col-md-4'
        }]
      }]
    })
    // 2 lines :
      // the first :  1 column with 12 of size
      // the second : 2 column with 6 of size
    .structure('12/6-6', {
      rows: [{
        columns: [{
          styleClass: 'col-md-12'
        }]
      }, {
        columns: [{
          styleClass: 'col-md-6'
        }, {
          styleClass: 'col-md-6'
        }]
      }]
    })
    // 3 lines :
      // the first : 	1 column with 12 of size
      // the second : 	2 column with 6 of size
      // the third : 	1 column with 12 of size
    .structure('12/6-6/12', {
      rows: [{
        columns: [{
          styleClass: 'col-md-12'
        }]
      }, {
        columns: [{
          styleClass: 'col-md-6'
        }, {
          styleClass: 'col-md-6'
        }]
      }, {
        columns: [{
          styleClass: 'col-md-12'
        }]
      }]
    });
    
});
