'use strict';

websoApp.config(function(dashboardProvider){
  
  dashboardProvider
    // 1 line : 2 columns with 6 of size
    .structure('1 ligne et 2 colonnes', {
      rows: [{
        columns: [{
          styleClass: 'col-md-6'
        }, {
          styleClass: 'col-md-6'
        }]
      }]
    })
    // 1 line : 3 colums with 6 of size
    .structure('1 ligne et 3 colonnes', {
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
    .structure('2 lignes : 1 colonne pour la 1ère ligne et 3 colonnes pour la 2ème ligne', {
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
    .structure('2 lignes : 1 colonne pour la 1ère ligne et 2 colonnes pour la 2ème ligne', {
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
    .structure('3 lignes : 1 colonne pour la 1ère et la 3ème ligne et 2 colonnes pour la 2ème ligne', {
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
