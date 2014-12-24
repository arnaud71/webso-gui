'use strict';

angular.module('websoApp')
  .controller('SourceListCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $window) {

        var $username = $cookieStore.get('username');     
/*
     Getting source
     */

    $scope.sourceList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl', type_s:'source',user_s:$username, callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.atomicChange = $resource(cfg.urlServices + 'db/:action',
      {action: 'change.pl', id: '', callback: "JSON_CALLBACK"},
      {put: {method: 'JSONP'}});

    $scope.filterOptions = {
      filterText: "",
      useExternalFilter: false


    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
      pageSizes: [10,100,1000],
      pageSize: 10,
      currentPage: 1
    };

    $scope.setPagingData = function(data, page, pageSize){
      $scope.totalServerItems = data.success.response.numFound;
      data = data.success.response.docs;
      //var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
      $scope.myData = data;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
     // setTimeout(function () {
        var data;
        $scope.sourceResult = $scope.sourceList.get({rows:pageSize,start:(page*pageSize-pageSize)},
          function() {        //call back function for asynchronous
            if (typeof $scope.sourceResult.success.response === "undefined") {}
            else {
              data = $scope.sourceResult;
              $scope.setPagingData(data,page,pageSize);
              //$('.row').trigger('resize');
            }
          }
        );

      //}, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
      if ((newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) || (newVal !== oldVal && newVal.pageSize !== oldVal.pageSize)) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);


    $scope.gridOptionsSource = {
      data: 'myData',
      enablePaging: true,
      enableRowSelection : false,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions,
      showFilter: true,

      //selectWithCheckboxOnly: 'true',
      //selectedItems: $scope.mySelections,
      columnDefs: [
        {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
        {visible:false,width:'50px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'*',field:'url_s', displayName:  'Source',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },
        {width:'*',field:'title_t', displayName:  'Title', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'tags_s', displayName:  'Tag', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        // {width:'100px',field:'domain_s', displayName:  'Domaine', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'user_s', displayName:  'Auteur', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        //{width:'100px',field:'IsWatched_b', displayName:  'Surveillance', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'creation_dt', displayName:  'Création', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'', displayName:  'Gestion', cellTemplate: '<button type="button" class="btn btn-xs" ng-click="edit(row)"><span class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-xs" ng-click="doDelete(row.getProperty(\'id\'),row.rowIndex)" tooltip="Effacer le document"><span class="glyphicon glyphicon-trash"></span></button>'}
      ]
    };

    $scope.addWatch = function (sourceId){
      $window.location.href = '#/watch/add';
    }




    $scope.doSearch = function () {
      $scope.sourceResult = $scope.sourceList.get({type_s:'source'},
        function() {        //call back function for asynchronous
          if (typeof $scope.sourceResult.success.response === "undefined") {}
          else {
            $scope.myData = $scope.sourceResult.success.response.docs;

            $('.row').trigger('resize');
          }
        }
      );


    };

    /*
     Deleting source
     */

    $scope.sourceDelete = $resource(cfg.urlServices+'db/:action',
      {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.doDelete = function (sourceId,index) {
        /*
         Confirm dialogs
         */

        var deleteSource = confirm('Etes vous sûr de vouloir supprimer cette source?');
        if (deleteSource) {
            alert('Suppression confirmée');

            /*
             Delete from Docs
             */
            $scope.sourceAddResult = $scope.sourceDelete.get({
                id  :     sourceId
            });
            /*
             Delete from table
             */
            $scope.myData.splice(index, 1);
        }

        //  $('#myModal').modal('show');

      //$('.row').trigger('resize');
      //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    };

    $scope.edit = function(obj){
      $scope.ModalForm                   = {};
      $scope.ModalForm.url               = '';
      $scope.ModalForm.title             = '';
      $scope.ModalForm.tags              = '';
      $scope.ModalForm.frequency         = {option: ''};
      $scope.ModalForm.domain            = {name: ''};
      $scope.ModalForm.activity          = {name: ''};

      var modalInstance = $modal.open({
        templateUrl: 'editSourceModal.html',
        controller: ModalInstanceEditCtrl,
        scope: $scope,
        resolve: {
          data: function () {
            return obj.entity;
          }
        }
      });

      modalInstance.result.then(function (result) {
          $scope.atomicChange.put({
            id            : result.id,
            url_s         : result.url,
            tags_s        : result.tags,
            title_t       : result.title,
            refresh_s     : result.frequency.option,
            // domain_s      : result.domain.name,
            // activity_s    : result.activity.name,
          });
      });
    }

    var ModalInstanceEditCtrl = function ($scope, $modalInstance, data) {
      $scope.ModalForm                   = {};
      $scope.ModalForm.id                = data.id;
      $scope.ModalForm.url               = data.url_s;
      $scope.ModalForm.title             = data.title_t;
      $scope.ModalForm.tags              = data.tags_s;
      $scope.ModalForm.frequency         = {option: data.refresh_s};
      $scope.ModalForm.frequencies       = [{option:'1h'}, {option:'12h'}, {option:'24h'}, {option:'48h'}];
      // $scope.ModalForm.domain            = {'name': data.domain_s};
      // $scope.ModalForm.domains           = $scope.domains;
      // $scope.ModalForm.activity          = {'name': data.activity_s};


      $scope.ok = function () {
        $modalInstance.close($scope.ModalForm);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    };

    //$scope.doSearch();
            /*
     Domains menu
     */
    $scope.domains =  [
      {name:'Technologie',activites:[
        {name:'Publications scientifiques'},
        {name:'Brevets/marques'}
      ]},
      {name:'Economie/Politique',activites:[
        {name:'Organismes publics'},
        {name:'Etudes de marchés'},
        {name:'Bases de données entreprises'},
        {name:'Appel d\'offres'},
        {name:'Informations financières'}
      ]},
      {name:'Concurrence/Entreprises',activites:[
        {name:'Agriculture, Sylviculture, et pêche'},
        {name:'Industries extractives'},
        {name:'Industries manufacturières'},
        {name:'Production et distribution d\'électricité, gaz, vapeur, air conditionné'},
        {name:'Production et distribution d\'eau, assainissement, gestion des déchets et dépollution'},
        {name:'Construction'},
        {name:'Commerce, réparation d\'automobiles, et motocycles'},
        {name:'Transport et entreposage'},
        {name:'Hébergement et restauration'},
        {name:'Information et communication'},
        {name:'Activité financières et assurances'},
        {name:'Activités immobilières'},
        {name:'Activités spécialisées scientifiques et techniques'},
        {name:'Activités de service administratifs et de soutien'},
        {name:'Administration publique'},
        {name:'Enseignement'},
        {name:'Santé humaine, action sociale'},
        {name:'Arts, spectacles, activités récréatives'},
        {name:'Autres activités de services'},
        {name:'Activités de ménages'},
        {name:'Activités extra territoriales'},
      ]},
      {name:'Juridique/réglementaire'},
      {name:'Réseaux sociaux'},
      {name:'Presse',activites:[
        {name:'Agricole/Agroalimentaire'},
        {name:'Assurance'},
        {name:'Arts/Musique/Spectacle'},
        {name:'Automobile'},
        {name:'Autres services'},
        {name:'Batiment'},
        {name:'Bijoux'},
        {name:'Bois, Papier, Carton'},
        {name:'Communication'},
        {name:'Distribution'},
        {name:'Economie/ Finance'},
        {name:'Environnement'},
        {name:'Géopolitique, Défense'},
        {name:'Industrie & Techniques'},
        {name:'Informatique et réseaux'},
        {name:'Jeux et Jouets'},
        {name:'Juridique'},
        {name:'Petite enfance'},
        {name:'People'},
        {name:'Photo'},
        {name:'Restauration/Hotellerie'},
        {name:'Relation client/Ressources humaines'},
        {name:'Santé'},
        {name:'Transport'},
        {name:'Sport'},
        {name:'Tourisme & Voyages'},
        {name:'Urbanisme'},
        {name:'Vin et Boissons'},
        {name:'WebDesign et multimédia'}
      ]}
    ] ;

  });
