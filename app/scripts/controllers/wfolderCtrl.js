'use strict';

angular.module('websoApp')
  .controller('wfolderCtrl', function ($filter, $cookieStore, $scope, cfg, $resource) {

    var $username = $cookieStore.get('username');

    $scope.addResource = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl',user_s:$username,callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}}
    );

    // to query solr as a search engine
    $scope.solrResource = $resource(cfg.urlDB+'solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}}
    );
    
});