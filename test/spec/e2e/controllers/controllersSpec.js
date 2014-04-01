//
// test/e2e/controllers/controllersSpec.js
//
describe("Integration/E2E Testing", function() {

/*********************************************************************************************************/

 it('pouvoir aller à la page de log in', function() {
    browser.get('http://localhost:9000/#/signin');
    
    var inputPseudo = element(by.name('email'));
    inputPseudo.clear();
    inputPseudo.sendKeys('test_email');
        
    var inputMotDePasse = element(by.name('password'));
    inputMotDePasse.clear();
    inputMotDePasse.sendKeys('mot_de_passe');
    
    var checkBoxSeRappeler = element(by.name('remember'));
    checkBoxSeRappeler.click();

    var button = element(by.name('Connexion'));
    button.click();
 });

 /********************************** fonctionnel (Ajout d'informations) ***********************************/

  it('pouvoir aller à la page Valider > Ajouter information et ajouter une information valide', function() {
    browser.get('http://localhost:9000/#/validate/add');

    var inputTitle = element(by.input('inputTitle'));
    inputTitle.clear();
    inputTitle.sendKeys('test titre');

    var inputUrl = element(by.input('inputUrl'));
    inputUrl.clear();
    inputUrl.sendKeys('test lien');

    var inputTags = element(by.input('inputTags'));
    inputTags.clear();
    inputTags.sendKeys('test tag');

    var inputDetails = element(by.textarea('inputDetails'));
    inputDetails.clear();
    inputDetails.sendKeys('test detail');

    var button = element(by.name('validate'));
    button.click();
  });

/*********************************** fonctionnel (Affichage des informations validées) *******************/

  it('pouvoir aller à la page Valider > Afficher informations validées', function() {
    browser.get('http://localhost:9000/#/validate/display');
    // s'assurer que l'information ajoutée est bien ajoutée et affichée
	element.all(by.repeater('validation in validationResult.success.response.docs')).then(function(results) {
	    var lastTitle = element(by.repeater('validation in validationResult.success.response.docs').row(results.length-1).column('{{validation.title_s}}'));
    	expect(lastTitle.getText()).toBe('test titre');

	    var lastUrl = element(by.repeater('validation in validationResult.success.response.docs').row(results.length-1).column('{{validation.url_s}}'));
    	expect(lastUrl.getText()).toBe('test lien');

	    var lastUser = element(by.repeater('validation in validationResult.success.response.docs').row(results.length-1).column('{{validation.user_s}}'));
    	expect(lastUser.getText()).toBe('user_0');
	});
  });

/*********************************** fonctionnel (Ajouter une source) ************************************/

  it('pouvoir aller à la page Surveiller > Ajouter une source et ajouter une source valide', function() {
    browser.get('http://localhost:9000/#/source/sourceAdd');

    var inputUrl = element(by.input('inputUrl'));
    inputUrl.clear();
    inputUrl.sendKeys('test source');

    var inputTitle = element(by.input('inputTitle'));
    inputTitle.clear();
    inputTitle.sendKeys('test titre');

    var inputTags = element(by.input('inputTags'));
    inputTags.clear();
    inputTags.sendKeys('test tag');
    
    var button = element(by.name('add'));
    button.click();
    
  });

/*********************************** fonctionnel (Affichage des sources) *********************************/

  it('pouvoir aller à la page Surveiller > Afficher les sources', function() {
    browser.get('http://localhost:9000/#/source/sourcesList');
    // s'assurer que la sources ajoutée est bien ajoutée et affichée
  });

  it('pouvoir aller à la page Surveiller > Afficher les sources et supprimer une sources', function() {
    browser.get('http://localhost:9000/#/source/sourcesList');
    // s'assurer que la sources supprimée a été bien supprimée
  });
  
  it('pouvoir aller à la page Surveiller > Afficher les sources et modifier une sources', function() {
    browser.get('http://localhost:9000/#/source/sourcesList');
    // s'assurer que la sources modifiée a été bien modifiée
  });  

/********************************** fonctionnel (Ajouter une surveillance) *******************************/

  it('pouvoir aller à la page Surveiller > Ajouter une surveillance et ajouter une surveillance valide', function() {
    browser.get('http://localhost:9000/#/watch/add');
    
    var inputSource = element(by.name('inputUrl'));
    inputSource.clear();
    inputSource.sendKeys('test surveillance');
    
    var inputTitle = element(by.input('inputTitle'));
    inputTitle.clear();
    inputTitle.sendKeys('test titre');

    var inputTags = element(by.input('inputTags'));
    inputTags.clear();
    inputTags.sendKeys('test tag');

    // choisir le dossier de surveillance. c'est un menu de choix
	var selectedDomain = element(by.xpath('//select[@name="inputDomain"]/option[text()="domaine 1"]')); 
  	selectedDomain.click();

    // choisir le domaine de surveillance. c'est un menu de choix
	var selectedActivity = element(by.xpath('//select[@id="inputActivity"]/option[text()="Secteur dactivité 2"]')); 
  	selectedActivity.click();

    // choisir le secteur d'activité pour la surveillance. c'est un menu de choix
  	var selectedFolder = element(by.xpath('//select[@name="inputFolderName"]/option[text()="Dossier 3"]')); 
  	selectedFolder.click();

    var inputRequete = element(by.name('requete'));
    inputRequete.clear();
    inputRequete.sendKeys('test requête');

    var button = element(by.name('testButton'));
    button.click();
    
    // choisir une frequence pour la surveillance. c'est un menu de choix
  	var selectedFrequency = element(by.xpath('//select[@ng-model="freq"]/option[text()="1 mois"]')); 
  	selectedFrequency.click();

    // choisir le mode de notification pour la surveillance. c'est un menu de choix
  	var selectedSurveillance = element(by.xpath('//select[@ng-model="notification"]/option[text()="email"]')); 
  	selectedSurveillance.click();

    var button = element(by.name('surveiller'));
    button.click();
  });

/********************************** fonctionnel (Afficher les surveillances) ******************************/
//	Bug détecté : une surveillance a été ajoutée dans le dossier 3 							  	
//	Resultat de l'affichage : la surveillance a été ajoutée dans le dossier 1
																										  																			  
  it('pouvoir aller à la page Surveiller > Afficher les surveillances', function() {
    browser.get('http://localhost:9000/#/watch/watchList');
    // s'assurer de la surveillance ajoutée et affichée
	element.all(by.repeater('watch in watchResult.success.response.docs')).then(function(results) {
	    var lastTitle = element(by.repeater('watch in watchResult.success.response.docs').row(results.length-1).column('{{watch.title_t}}'));
    	expect(lastTitle.getText()).toBe('test titre');

	    var lastUrl = element(by.repeater('watch in watchResult.success.response.docs').row(results.length-1).column('{{watch.url_s}}'));
    	expect(lastUrl.getText()).toBe('test surveillance');

	    var lastName = element(by.repeater('watch in watchResult.success.response.docs').row(results.length-1).column('{{watch.folder_name_s}}'));
    	expect(lastName.getText()).toBe('Dossier de Surveillance 3');

	    var lastUser = element(by.repeater('watch in watchResult.success.response.docs').row(results.length-1).column('{{watch.user_s}}'));
    	expect(lastUser.getText()).toBe('user_0');
	});
  });

  it('pouvoir aller à la page Surveiller > Afficher les surveillances et supprimer une surveillance', function() {
    browser.get('http://localhost:9000/#/watch/watchList');
    // supprimer une source
    var numberOfResults;
    element.all(by.repeater('watch in watchResult.success.response.docs')).then(function(results) {
    	numberOfResults = results.length;
		element.all(by.repeater('watch in watchResult.success.response.docs')).get(numberOfResults-1).findElement(by.name('deleteSurveillance')).click();
	});

    // s'assurer que la surveillance supprimée a été bien supprimée
    element.all(by.repeater('watch in watchResult.success.response.docs')).then(function(results) {
		expect(element(by.repeater('watch in watchResult.success.response.docs').row(numberOfResults-1).column('{{watch.url_s}}')).isPresent()).toBe(false);
	});
  });
  
  it('pouvoir aller à la page Surveiller > Afficher les surveillances et modifier une surveillance', function() {
    browser.get('http://localhost:9000/#/watch/watchList');
    // s'assurer que la surveillance modifiée a été bien modifiée
  });  

/*********************************************************************************************************/
  it('pouvoir aller à la page Diffuser > Newsletter et diffuser une newsletter valide', function() {
    browser.get('http://localhost:9000/#/publish/newsletter');

    var inputTitle = element(by.name('titleNL'));
    inputTitle.clear();
    inputTitle.sendKeys('test titre');

    var inputEmail = element(by.name('email'));
    inputEmail.clear();
    inputEmail.sendKeys('test titre');

    var buttonAddEmail = element(by.name('addItem'));
    buttonAddEmail.click(); 
    
    var buttonOpenList = element(by.name('openList'));
    buttonOpenList.click(); 
    
    // choisir la date d'envoie c'est en format spécial
    var inputDate = element(by.name('date'));
    inputDate.clear();
    inputDate.sendKeys('30-06-2014');

    // choisir une frequence d'envoie. c'est un menu de choix
    /*
  var selectedDomain = element(by.xpath('//select[@ng-model="freq"]/option[text()="..."]')); 
    selectedDomain.click();
  */

    // choisir le dossier de validation.
    /*
    var buttonSelectionFolder = element(by.name('openFolders'));
    SelectionFolder.click();
  */

  /*
    var buttonCreateNl = element(by.name('createNL'));
    buttonCreateNl.click();
  */
  });
/*********************************************************************************************************/

  it('pouvoir aller à la page Diffuser > Rapport et diffuser un rapport valide', function() {
    browser.get('http://localhost:9000/#/publish/report');
    
    var inputTitle = element(by.input('inputTitle'));
    inputTitle.clear();
    inputTitle.sendKeys('test titre');

    // choisir le format du rapport. c'est un menu de choix
    var selectedFormat = element(by.xpath('//select[@ng-model="format"]/option[text()="html"]')); 
    selectedFormat.click();

    // selection de dossier de validation.
    /*
    var buttonSelectionFolder = element(by.name('openFolders'));
    SelectionFolder.click();
  */

    var button = element(by.name('createReport'));
    button.click(); 

  });

/*********************************************************************************************************/

  it('pouvoir aller à la page Organiser > Dossiers de surveillance', function() {
      browser.get('http://localhost:9000/#/');
      // en cours de construction ...
  });

/*********************************************************************************************************/

  it('pouvoir aller à la page Organiser > Dossiers de validation', function() {
    browser.get('http://localhost:9000/#/organize/vfolder');

    // s'assurer des dossiers de validations affichées
  });

/*********************************************************************************************************/

  it('pouvoir aller à la page Organiser > Templates', function() {
    browser.get('http://localhost:9000/#/');
      // en cours de construction
  });

/*********************************************************************************************************/

  it('pouvoir aller à la page Organiser > Collectes webso', function() {
    browser.get('http://localhost:9000/#/');
      // en cours de construction
  });

/*********************************************************************************************************/
 
  it('pouvoir aller à la page Organiser > Packages de sources', function() {
    browser.get('http://localhost:9000/#/');
      // en cours de construction
  });

/*********************************************************************************************************/  

  it('pouvoir aller à la page Organiser > Profils et ajouter un profil valide', function() {
    browser.get('http://localhost:9000/#/organize/profile');
    
    var inputNom = element(by.name('nom'));
    inputNom.clear();
    inputNom.sendKeys('test nom');
  
    var inputPrenom = element(by.name('prenom'));
    inputPrenom.clear();
    inputPrenom.sendKeys('test prenom');

    var inputRole = element(by.name('role'));
    inputRole.clear();
    inputRole.sendKeys('test role');

    var inputEmail = element(by.name('email'));
    inputEmail.clear();
    inputEmail.sendKeys('test email');

    var inputPassword = element(by.name('motDePasse'));
    inputPassword.clear();
    inputPassword.sendKeys('test password');

    var button = element(by.name('sauvegarder'));
    button.click(); 
  });

/*********************************************************************************************************/

  it('pouvoir aller à la page Tableau de bord', function() {
    browser.get('http://localhost:9000/#/');
      // en cours de construction
  });

/*********************************************************************************************************/
  
  it('pouvoir aller à la page Rechercher > Dossiers', function() {
    browser.get('http://localhost:9000/#/');
      // en cours de construction
  });

/********************************** Fonctionnel **********************************************************/

  it('pouvoir aller à la page Rechercher > Collectes webso et lancer une recherche valide', function() {
    browser.get('http://localhost:9000/#/search/webso');

    var searchTerm = element(by.model('searchTerm'));
    searchTerm.clear();
    searchTerm.sendKeys('test search');

    var button = element(by.name('searchButton'));
    button.click();
  });

/*********************************************************************************************************/

  it('pouvoir aller à la page Rechercher > Sources', function() {
    browser.get('http://localhost:9000/#/');
      // en cours de construction
  });

/********************************** Fonctionnel **********************************************************/

  it('pouvoir aller à la page Rechercher > Flux RSS et lancer une recherche valide', function() {
    browser.get('http://localhost:9000/#/search/rss');

    var searchTerm = element(by.name('searchTerm'));
    searchTerm.clear();
    searchTerm.sendKeys('test search');

    var button = element(by.buttonText('Search'));
    button.click();
  });

/*********************************************************************************************************/

});
