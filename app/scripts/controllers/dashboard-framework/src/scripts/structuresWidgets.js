'use strict';

websoApp.config(function(dashboardProvider){
  
  dashboardProvider
    // 1 lignes : aura 2 colonnes de taille 6 chacune
    .structure('6-6', {
      rows: [{
        columns: [{
          styleClass: 'col-md-6'
        }, {
          styleClass: 'col-md-6'
        }]
      }]
    })
    // 1 lignes : aura 3 colonnes de taille 4
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
    // 2 lignes :
      // la 1ere aura 1 colonne de taille 12
      // la 2eme aura 3 collonnes de taille 4 chacune
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
    // 2 lignes :
      // la 1ere aura 1 colonne de taille 12
      // la 2eme aura 2 collonnes de taille 6 chacune
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
    // 3 lignes :
      // la 1ere aura 1 colonne de taille 12
      // la 2eme aura 2 collonnes de taille 6 chacune
      // la 3eme aura 1 collone de taille 12
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
