angular.module('websoApp').constant('cfg', {

  versionWebso    : '0.7',
  errorConnect    : 'Problème de connexion avec le server, veuillez tester votre connexion à internet (ou le server n\'est pas disponible)',


 urlDB               : 'http://localhost:8983/',
 urlServices         : 'http://localhost/cgi-bin/webso-services/',
  urlBookmarklet      : '',
  querySearchTypeList : [
                {value:'google_news'  ,displayName:'Google News'},
                {value:'bing_news'    ,displayName:'Bing News'},
                {value:'yahoo_news'   ,displayName:'Yahoo News'},
                {value:'google_blog'  ,displayName:'Google Blog'},
                {value:'reddit'       ,displayName:'Reddit'},
                {value:'faroo_news'   ,displayName:'Faroo News'},
                {value:'delicious'    ,displayName:'delicious'}
                      ],

  //urlDB           : 'http://albator.hesge.ch:8983/',
  //urlServices     : 'http://albator.hesge.ch/cgi-bin/webso-services/',
  //urlBookmarklet  : 'http://albator.hesge.ch/web/webso-gui/'

});