"use strict";angular.module("websoApp",["ngRoute","ui.bootstrap","ngResource","ngSanitize","ngGrid"]),angular.module("websoApp").config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/comingsoon.html",controller:"SolrCtrl"}).when("/home",{templateUrl:"views/main.html"}).when("/search",{templateUrl:"views/main.html",controller:"SolrCtrl"}).when("/validate/add",{templateUrl:"views/information/validate.html"}).when("/validate/display",{templateUrl:"views/information/validationList.html"}).when("/watch/add",{templateUrl:"views/watch/watchAdd.html"}).when("/watch/sourceslist",{templateUrl:"views/source/list.html"}).when("/source/sourcesList",{templateUrl:"views/source/sourceList.html"}).when("/watch/watchList",{templateUrl:"views/watch/watchList.html"}).when("/publish/newsletter",{templateUrl:"views/report/createNL.html"}).when("/publish/report",{templateUrl:"views/report/createReport.html"}).when("/organize/survfolder",{templateUrl:"views/organise.html"}).when("/organize/sourcesfolder",{templateUrl:"views/organise.html"}).when("/organize/templates",{templateUrl:"views/organise.html"}).when("/organize/collect",{templateUrl:"views/organise.html"}).when("/organize/profile",{templateUrl:"views/user/userAdd.html"}).when("/organize/sources",{templateUrl:"views/sources/list.html"}).when("/organize/vfolder",{templateUrl:"views/report/reportList.html"}).when("/signin",{templateUrl:"views/signin.html"}).when("/search/rss",{templateUrl:"views/source/searchNew.html"}).when("/search/source",{templateUrl:"views/source/sourceList.html"}).when("/url/:id_url",{templateUrl:"views/source/formAdd.html",controller:"BarletCtrl"}).when("/text/:id_text",{templateUrl:"views/source/searchNew.html",controller:"BarletCtrl"}).when("/validate/:id_selection",{templateUrl:"views/validate.html",controller:"BarletCtrl"}).when("/source/searchNew",{templateUrl:"views/source/searchNew.html",controller:"GoogleFeedCtrl"}).when("/source/list",{templateUrl:"views/source/list.html",controller:"SourceDataCtrl"}).when("/source/sourceAdd",{templateUrl:"views/source/sourceAdd.html"}).when("/search/webso",{templateUrl:"views/search/webso.html",controller:"SolrCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("websoApp").constant("cfg",{urlDB:"http://albator.hesge.ch:8983/",urlServices:"http://albator.hesge.ch/cgi-bin/webso-services/db/"}),angular.module("websoApp").controller("AddSourceCtrl",["$scope","$resource",function(a,b){a.inputType="rss",a.inputRefresh=1440,a.inputLevel=0,a.inputUser="user_1",a.sourceAdd=b("http://albator.hesge.ch/cgi-bin/webso/sources/:action",{action:"put.json",source_user:"user_1",source_url:"",source_type:"source",source_level_sharing:"0",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doAdd=function(){a.sourceAddResult=a.sourceAdd.get({source_url:a.inputUrl,source_type:a.inputType,source_user:a.inputUser,source_level:a.inputLevel})}}]),angular.module("websoApp").controller("BarletCtrl",["$scope","$routeParams",function(a,b){a.textArg="rien",a.inputUrl="",a.searchTerm="",b.id_url&&(a.textArg=unescape(atob(decodeURIComponent(b.id_url))),a.inputUrl=a.textArg),b.id_text&&(a.textArg=b.id_text,a.searchTerm=a.textArg),b.id_selection&&(a.textArg=unescape(atob(decodeURIComponent(b.id_selection))),a.inputUrl=a.textArg)}]),angular.module("websoApp").controller("NLCtrl",["$scope",function(a){a.emails=[{Name:"test1@mail.com"},{Name:"test2@mail.com"}],a.addItem=function(b){a.emails.push(b),a.email={}},a.removeItem=function(b){a.emails.splice(b,1)}}]),angular.module("websoApp").controller("DatepickerCtrl",["$scope","$timeout",function(a,b){a.freq="1 semaine",a.options={freq:["1 jour","1 semaine","1 mois"]},a.today=function(){a.dt=new Date},a.today(),a.showWeeks=!0,a.toggleWeeks=function(){a.showWeeks=!a.showWeeks},a.clear=function(){a.dt=null},a.disabled=function(a,b){return"day"===b&&(0===a.getDay()||6===a.getDay())},a.toggleMin=function(){a.minDate=a.minDate?null:new Date},a.toggleMin(),a.open=function(){b(function(){a.opened=!0})},a.dateOptions={"year-format":"'yy'","starting-day":1}}]),angular.module("websoApp").controller("reportCtrl",["$scope","$resource",function(a,b){a.format="",a.template="",a.options={format:["html"],template:["template 1"]},a.inputTitle="",a.reportAdd=b("http://albator.hesge.ch/cgi-bin/webso/sources/:action",{action:"put_Report.json",source_user:"user_1",report_title:"title test",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doAdd=function(){a.reportAddResult=a.reportAdd.get({report_title:a.inputTitle})}}]),angular.module("websoApp").controller("UnderconstructionCtrl",["$scope","$modal","$log",function(a,b,c){a.open=function(){var d=b.open({templateUrl:"underconstruction.html",controller:ModalInstanceCtrl});d.result.then(function(b){a.selected=b},function(){c.info("Modal dismissed at: "+new Date)})}}]),angular.module("websoApp").controller("informationOkCtrl",["$scope","$modal","$log",function(a,b,c){a.open=function(){var d=b.open({templateUrl:"informationOk.html",controller:ModalInstanceCtrl});d.result.then(function(b){a.selected=b},function(){c.info("Modal dismissed at: "+new Date)})}}]);var ModalInstanceCtrl=function(a,b){a.close=function(){b.dismiss("Fermer")}};angular.module("websoApp").controller("treeCtrl",["$scope",function(a){a.delete=function(a){a.nodes=[]},a.add=function(a){var b=a.nodes.length+1,c=a.name+"-"+b;a.nodes.push({name:c,nodes:[]})},a.tree=[{name:"Node",nodes:[]}]}]),angular.module("websoApp").controller("AccordionDemoCtrl",["$scope",function(a){a.addItem=function(){var b=a.items.length+1;a.items.push("Item "+b)}}]),angular.module("websoApp").controller("displayValidatedInfosCtrl",["$scope","$resource",function(a,b){a.informationData=b("http://albator.hesge.ch/cgi-bin/webso/sources/:action",{action:"get_Information.json",source_user:"user_2",information_url:"*",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doSearch=function(){a.informationResult=a.informationData.get()},a.doSearch()}]),angular.module("websoApp").controller("displayReportCtrl",["$scope","$resource",function(a,b){a.reportData=b("http://albator.hesge.ch/cgi-bin/webso/sources/:action",{action:"get_Report.json",source_user:"user_1",report_title:"*",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doSearch=function(){a.reportResult=a.reportData.get()},a.doSearch()}]),angular.module("websoApp").controller("displaySurveillanceCtrl",["$scope","$resource",function(a,b){a.surveillanceData=b("http://albator.hesge.ch/cgi-bin/webso/sources/:action",{action:"get_Surveillance.json",source_user:"user_1",surveillance_url:"*",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doSearch=function(){a.surveillanceResult=a.surveillanceData.get()},a.doSearch()}]),angular.module("websoApp").controller("getValidatedDataCtrl",["$scope","$http",function(a,b){b.get("/data/example.json").success(function(b){a.pages=b})}]),angular.module("websoApp").controller("menuCtrl",["$scope",function(a){a.domains=[{name:"domaine 1"},{name:"domaine 2"},{name:"domaine 3"}],a.domain=a.domains[2],a.activities=[{name:"Secteur dactivité 1"},{name:"Secteur dactivité 2"},{name:"Secteur dactivité 3"}],a.activity=a.activities[2],a.folderName=[{name:"Dossier 1"},{name:"Dossier 2"},{name:"Dossier 3"}],a.folder=a.folderName[2],a.notifications=[{name:"Pas de notification"},{name:"email"}],a.notification=a.notifications[0]}]),angular.module("websoApp").controller("addInfoCtrl",["$scope","$resource",function(a,b){a.inputLevel=0,a.inputUrl="",a.inputTitle="",a.inputDetail="",a.inputComment="",a.inputRefresh=1440,a.informationAdd=b("http://albator.hesge.ch/cgi-bin/webso/sources/:action",{action:"put_Information.json",source_user:"user_2",information_url:"",information_type:"information",information_title:"",information_detail:"",information_comment:"",information_level_sharing:"0",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doAdd=function(){a.informationAddResult=a.informationAdd.get({information_url:a.inputUrl,information_type:a.inputType,information_level_sharing:a.inputLevel,information_title:a.inputTitle,information_detail:a.inputDetail,information_comment:a.inputComment})}}]),angular.module("websoApp").controller("addSurvCtrl",["$scope","$resource",function(a,b){a.inputType="rss",a.inputLevel=0,a.inputUser="user_1",a.inputUrl="",a.inputTitle="",a.inputDetail="",a.inputComment="",a.inputRefresh=1440,a.inputTitle="",a.inputTag="",a.inputDomain="",a.inputActivity="",a.inputFrequency="",a.surveillanceAdd=b("http://albator.hesge.ch/cgi-bin/webso/sources/:action",{action:"put_Surveillance.json",surveillance_url:"http://en.wikipedia.org/wiki/Global_warming",source_user:"user_1",surveillance_type:"surveillance",surveillance_title:"",surveillance_tag:"",surveillance_domain:"",surveillance_activity:"",surveillance_frequency:"",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doAdd=function(){a.surveillanceAddResult=a.surveillanceAdd.get({surveillance_title:a.inputTitle,surveillance_tag:a.inputTag,surveillance_domain:a.inputDomain,surveillance_activity:a.inputActivity,surveillance_frequency:a.inputFrequency})}}]),angular.module("websoApp").controller("ngCkeditor",["$scope",function(a){a.editorOptions={language:"ru",uiColor:"#000000"}}]),angular.module("websoApp").controller("GoogleFeedCtrl",["$scope","$resource",function(a,b){a.msgSelect="Select All",a.mySelections=[],a.foundRes=0,a.nameController="GoogleFeedCtrl",a.googleFeed=b("https://ajax.googleapis.com/ajax/services/feed/:action",{action:"find",v:"1.0",q:"technology",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.gridOptions={data:"myData",selectedItems:a.mySelections,columnDefs:[{field:"url",displayName:"Source",cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>'},{field:"title",displayName:"Title",cellTemplate:'<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},{field:"link",displayName:"From",cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>'}]},a.doSearch=function(){a.searchTerm&&(a.googleFeedResult=a.googleFeed.get({q:a.searchTerm},function(){"undefined"==typeof a.googleFeedResult.responseData||(a.myData=a.googleFeedResult.responseData.entries,a.foundRes=a.googleFeedResult.responseData.entries.length,$(".row-fluid").trigger("resize"))}))},a.selectAll=function(){angular.forEach(a.myData,function(b,c){a.gridOptions.selectItem(c,"Select All"==a.msgSelect)}),a.msgSelect="Select All"==a.msgSelect?"Deselect All":"Select All"},a.createOPML=function(){}}]),angular.module("websoApp").controller("SolrCtrl",["$scope","$resource","cfg",function(a,b,c){a.showFound=!1,a.currentPage=1,a.maxSize=5,a.bigCurrentPage=1,a.myDataDate=[{period:"jour",fq:"date_dt:[NOW/DAY-1DAY TO NOW/DAY+1DAY]"},{period:"semaine",fq:"date_dt:[NOW/DAY-7DAY TO NOW/DAY+1DAY]"},{period:"mois",fq:"date_dt:[NOW/DAY-30DAY TO NOW/DAY+1DAY]"},{period:"tout",fq:""}],a.mySelectionsPeriod=[],a.currentPeriod="all",a.currentFq="",a.solr=b(c.urlDB+"solr/collection1/:action",{action:"browse",q:"",fq:"",wt:"json",hl:"true",start:"0","json.wrf":"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.gridOptionsPeriod={data:"myDataDate",selectedItems:a.mySelectionsPeriod,multiSelect:!1,enableSorting:!1,enablePaging:!1,afterSelectionChange:function(){angular.forEach(a.mySelectionsPeriod,function(b){a.currentPeriod=b.period,a.currentFq=b.fq})},headerRowHeight:30,columnDefs:[{visible:"true",field:"period",displayName:"Dernier",cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>'}]},a.doSearch=function(){a.searchTerm&&(a.currentPage=1,a.maxSize=5,a.bigCurrentPage=1,a.solrResult=a.solr.get({q:a.searchTerm,start:a.currentPage-1,fq:a.currentFq},function(){a.totalItems=a.solrResult.response.numFound,a.bigTotalItems=a.solrResult.response.numFound}))},a.doSearchFromPage=function(){a.searchTerm&&(a.solrResult=a.solr.get({q:a.searchTerm,start:10*(a.currentPage-1),fq:a.currentFq},function(){a.totalItems=a.solrResult.response.numFound,a.bigTotalItems=a.solrResult.response.numFound}),a.totalItems=a.solrResult.response.numFound,a.bigTotalItems=a.solrResult.response.numFound)},a.$watch("currentPeriod",function(){a.doSearch()}),a.pageChanged=function(b){a.currentPage=b,a.doSearchFromPage()}}]),angular.module("websoApp").controller("CollapseSolrCtrl",["$scope",function(a){a.isCollapsed=!0}]),angular.module("websoApp").controller("SourceDataCtrl",["$scope","$resource","cfg",function(a,b,c){a.totalItems=30,a.currentPage=2,a.maxSize=15,a.itemsPerPage=10,a.setPage=function(b){a.currentPage=b},a.sourceData=b(c.urlServices+":action",{action:"get.pl",type_s:"source",user_s:"user_0",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doSearch=function(){a.sourceResult=a.sourceData.get()},a.sourceDelete=b(c.urlServices+":action",{action:"delete.pl",id:"",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doDelete=function(b,c){a.sourceAddResult=a.sourceDelete.get({id:b}),a.sourceResult.success.response.docs.splice(c,1)},a.doSearch(),a.test=function(a,b){console.log("... Testing source update ..."+a+b)}}]),angular.module("websoApp").controller("SourceListCtrl",["$scope","$resource","cfg",function(a,b,c){a.sourceList=b(c.urlServices+":action",{action:"get.pl",type_s:"source",user_s:"user_0",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.filterOptions={filterText:"",useExternalFilter:!1},a.totalServerItems=0,a.pagingOptions={pageSizes:[10,100,1e3],pageSize:10,currentPage:1},a.setPagingData=function(b){a.totalServerItems=b.success.response.numFound,b=b.success.response.docs,a.myData=b,a.$$phase||a.$apply()},a.getPagedDataAsync=function(b,c){var d;a.sourceResult=a.sourceList.get({rows:b,start:c*b-b},function(){"undefined"==typeof a.sourceResult.success.response||(d=a.sourceResult,a.setPagingData(d,c,b))})},a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage),a.$watch("pagingOptions",function(b,c){(b!==c&&b.currentPage!==c.currentPage||b!==c&&b.pageSize!==c.pageSize)&&a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage,a.filterOptions.filterText)},!0),a.$watch("filterOptions",function(b,c){b!==c&&a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage,a.filterOptions.filterText)},!0),a.gridOptionsSource={data:"myData",enablePaging:!0,enableRowSelection:!1,showFooter:!0,totalServerItems:"totalServerItems",pagingOptions:a.pagingOptions,filterOptions:a.filterOptions,showFilter:!0,columnDefs:[{width:"50px",field:"",displayName:"Nb",cellTemplate:'<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},{visible:!1,width:"50px",field:"id",displayName:"Id",cellTemplate:'<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},{width:"*",field:"url_s",displayName:"Source",cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>'},{width:"*",field:"title_t",displayName:"Title",cellTemplate:'<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},{width:"100px",field:"tags_s",displayName:"Tag",cellTemplate:'<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},{width:"100px",field:"domain_s",displayName:"Domaine",cellTemplate:'<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},{width:"100px",field:"user_s",displayName:"Auteur",cellTemplate:'<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},{width:"100px",field:"IsWatched_b",displayName:"Surveillance",cellTemplate:'<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},{width:"100px",field:"",displayName:"Gestion",cellTemplate:' <button type="button" class="btn btn-xs" ng-click="doDelete(row.getProperty(\'id\'),row.rowIndex)"><span class="glyphicon glyphicon-trash"></span></button><button type="button" class="btn btn-xs" ng-click="test(source.id,source.url_s)"><span class="glyphicon glyphicon-pencil"></span></button>'}]},a.doSearch=function(){a.sourceResult=a.sourceList.get({type_s:"source"},function(){"undefined"==typeof a.sourceResult.success.response||(a.myData=a.sourceResult.success.response.docs,$(".row").trigger("resize"))})},a.sourceDelete=b(c.urlServices+":action",{action:"delete.pl",id:"",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doDelete=function(b,c){a.sourceAddResult=a.sourceDelete.get({id:b}),a.myData.splice(c,1)}}]),angular.module("websoApp").controller("AddWatchCtrl",["$scope","$resource","cfg",function(a,b,c){a.inputUrl="http://www.apache.org",a.inputTags="server",a.inputTitle="Apache home page",a.inputDomain="Domaine 1",a.inputActivity="Activité 1",a.inputFrequency="1 semaine",a.inputFolderName="Dossier de Surveillance 1",a.inputCreationDate=Date.now(),a.watchAdd=b(c.urlServices+":action",{action:"put.pl",type_s:"watch",user_s:"user_0",level_sharing_i:"1",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.sourceAdd=b(c.urlServices+":action",{action:"put.pl",type_s:"source",user_s:"user_0",level_sharing_i:"1",source_type_s:"rss",isWatched_b:"true",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doAdd=function(){a.watchAddResult=a.watchAdd.get({url_s:a.inputUrl,title_t:a.inputTitle,domain_s:a.inputDomain,activity_s:a.inputActivity,frequency_s:a.inputFrequency,folder_name_s:a.inputFolderName}),a.sourceAddResult=a.sourceAdd.get({url_s:a.inputUrl,tags_s:a.inputTags,title_t:a.inputTitle,domain_s:a.inputDomain,activity_s:a.inputActivity,creation_d:a.inputCreationDate})}}]),angular.module("websoApp").controller("ValidationDataCtrl",["$scope","$resource","cfg",function(a,b,c){a.validationData=b(c.urlServices+":action",{action:"get.pl",type_s:"validation",user_s:"user_0",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doSearch=function(){a.validationResult=a.validationData.get()},a.doSearch()}]),angular.module("websoApp").controller("WatchDataCtrl",["$scope","$resource","cfg",function(a,b,c){a.watchData=b(c.urlServices+":action",{action:"get.pl",type_s:"watch",user_s:"user_0",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doSearch=function(){a.watchResult=a.watchData.get()},a.watchDelete=b(c.urlServices+":action",{action:"delete.pl",id:"",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doDelete=function(b,c){a.watchDeleteResult=a.watchDelete.get({id:b}),a.watchResult.success.response.docs.splice(c,1)},a.doSearch()}]),angular.module("websoApp").controller("CarouselCtrl",["$scope",function(a){a.myInterval=8e3;var b=a.slides=[];a.addSlide=function(){b.push({image:"images/definition_veille.jpg",text:["Webso","Recherche","Validation","Diffusion"][b.length%4]})};for(var c=0;4>c;c++)a.addSlide()}]),angular.module("websoApp").controller("AddInformationCtrl",["$scope","$resource","cfg",function(a,b,c){a.inputUrl="http://www.apache.org",a.inputTags="server",a.inputTitle="Apache home page",a.inputDetails="",a.informationAdd=b(c.urlServices+":action",{action:"put.pl",type_s:"validation",user_s:"user_0",level_sharing_i:"1",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}}),a.doAdd=function(){a.informationAddResult=a.informationAdd.get({url_s:a.inputUrl,tags_s:a.inputTags,title_s:a.inputTitle,details_s:a.inputDetails})}}]);