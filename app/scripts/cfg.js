angular.module('websoApp').constant('cfg', {

  versionWebso    : '0.8',
  errorConnect    : '_ERROR_CONN_',


  urlDB               : 'http://localhost:8983/',
  urlServices         : 'http://localhost/cgi-bin/webso-services/',
  urlBookmarklet      : '',
  querySearchTypeList : [
                {value:'google_news'  ,displayName:'Google News'},
              //  {value:'bing_news'    ,displayName:'Bing News'},
              //  {value:'yahoo_news'   ,displayName:'Yahoo News'},
              //  {value:'google_blog'  ,displayName:'Google Blog'},
              //  {value:'reddit'       ,displayName:'Reddit'},
              //  {value:'faroo_news'   ,displayName:'Faroo News'},
              //  {value:'delicious'    ,displayName:'delicious'}
                      ],
  hideForTest         : true,
  heg                 : false,

  //urlDB           : 'http://195.176.237.198:8983/',
  //urlServices     : 'http://cgi.inelio.fr/',
  //urlBookmarklet  : 'http://beta.inelio.fr/'

  //urlDB           : 'http://albator.hesge.ch:8983/',
  //urlServices     : 'http://albator.hesge.ch/cgi-bin/webso-services/',
  //urlBookmarklet  : 'http://albator.hesge.ch/web/webso-gui/'

});