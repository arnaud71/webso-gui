//
// test/e2e/controllers/controllersSpec.js
//
describe("Integration/E2E Testing", function() {
  /*********************************************************************************************************/
  it('pouvoir aller à la page de log in', function() {
    browser.get('http://localhost:9000/#/signin');
    
    /*
    var inputPseudo = element(by.name('pseudo'));
    inputPseudo.clear();
    inputPseudo.sendKeys('test_pseudo');
    */
    
    /*
    var inputMotDePasse = element(by.name('password'));
    inputMotDePasse.clear();
    inputMotDePasse.sendKeys('mot_de_passe');
    */

    /*
    var checkBoxSeRappeler = element(by.name('se_rappeler'));
    checkBoxSeRappeler.click();
    */

    /*
    var button = element(by.name('Connexion'));
    button.click();
    */
 	});
/*********************************************************************************************************/
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

    // var button = element(by.button('doAdd()'));
    // button.click();
  });
/*********************************************************************************************************/
  it('pouvoir aller à la page Valider > Afficher informations validées', function() {
    browser.get('http://localhost:9000/#/validate/display');
    // s'assurer des informations affichées
  });
/*********************************************************************************************************/
  it('pouvoir aller à la page Surveiller > Ajouter une surveillance et ajouter une surveillance valide', function() {
    browser.get('http://localhost:9000/#/watch/add');


    /*
    var inputSource = element(by.input('text'));
    inputSource.clear();
    inputSource.sendKeys('test source');
    */
    
    var inputTitle = element(by.input('inputTitle'));
    inputTitle.clear();
    inputTitle.sendKeys('test titre');

    var inputTags = element(by.input('inputTags'));
    inputTags.clear();
    inputTags.sendKeys('test tag');

    // choisir le dossier de surveillance. c'est un menu de choix
    // choisir le domaine de surveillance. c'est un menu de choix
    // choisir le secteur d'activité pour la surveillance. c'est un menu de choix

    /*
    var inputRequete = element(by.input('inputRequete'));
    inputRequete.clear();
    inputTitle.sendKeys('test requête');
    */

    /*
     var button = element(by.button('btn'));
     button.click();
    */
    
    // choisir une frequence pour la surveillance. c'est un menu de choix
    // choisir le mode de notification pour la surveillance. c'est un menu de choix

    // var button = element(by.button('doAdd()'));
    // button.click();
  });
/*********************************************************************************************************/
  it('pouvoir aller à la page Surveiller > Ajouter une source et ajouter une source valide', function() {
    browser.get('http://localhost:9000/#/source/sourceAdd');

    var inputUrl = element(by.input('inputUrl'));
    inputUrl.clear();
    inputUrl.sendKeys('test lien');

    var inputTitle = element(by.input('inputTitle'));
    inputTitle.clear();
    inputTitle.sendKeys('test titre');

    var inputTags = element(by.input('inputTags'));
    inputTags.clear();
    inputTags.sendKeys('test tag');
    
    /*
    var button = element(by.button('doAdd()'));
    button.click();
    */
  });
/*********************************************************************************************************/
  
  it('pouvoir aller à la page Surveiller > Afficher les sources', function() {
    browser.get('http://localhost:9000/#/source/sourcesList');

    // s'asurer des sources affichées
  });

/*********************************************************************************************************/
  
  it('pouvoir aller à la page Surveiller > Afficher les surveillances', function() {
    browser.get('http://localhost:9000/#/watch/watchList');

    // s'assurer des surveillances affichées
  });
  
/*********************************************************************************************************/
  it('pouvoir aller à la page Diffuser > Newsletter et diffuser une newsletter valide', function() {
    browser.get('http://localhost:9000/#/publish/newsletter');
    /*
    var inputTitle = element(by.input('inputTitle'));
    inputTitle.clear();
    inputTitle.sendKeys('test lien');
    */

    /*
    var inputEmail = element(by.input('inputEmail'));
    inputEmail.clear();
    inputEmail.sendKeys('test titre');
    */
    
    // choisir la date d'envoie c'est en format spécial
    // choisir une frequence d'envoie. c'est un menu de choix
    // choisir le dossier de validation. c'est un menu de choix
    
    /*
    var button = element(by.button('...'));
    button.click(); 
    */
  });
/*********************************************************************************************************/
  it('pouvoir aller à la page Diffuser > Rapport et diffuser un rapport valide', function() {
    browser.get('http://localhost:9000/#/publish/report');
    
    var inputTitle = element(by.input('inputTitle'));
    inputTitle.clear();
    inputTitle.sendKeys('test titre');

    // choisir le format du rapport. c'est un menu de choix 
    // selection de dossier de validation. c'est un menu de choix 

    /*
    var button = element(by.button('...'));
    button.click(); 
    */
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
    /*
    var inputNom = element(by.input('inputNom'));
    inputNom.clear();
    inputNom.sendKeys('test nom');
    */

    /*
    var inputPrenom = element(by.input('inputPrenom'));
    inputPrenom.clear();
    inputPrenom.sendKeys('test prenom');
    */

    /*
    var inputEmail = element(by.input('inputEmail'));
    inputEmail.clear();
    inputEmail.sendKeys('test email');
    */

    /*    
    var inputPassword = element(by.textarea('inputPassword'));
    inputPassword.clear();
    inputPassword.sendKeys('test password');
    */

    /*
    var button = element(by.button('...'));
    button.click(); 
    */
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

/*********************************************************************************************************/
  it('pouvoir aller à la page Rechercher > Collectes webso et lancer une recherche valide', function() {
    browser.get('http://localhost:9000/#/search/webso');

    var searchTerm = element(by.input('searchTerm'));
    searchTerm.clear();
    searchTerm.sendKeys('test search');

    /*
    var button = element(by.button('doAdd()'));
    button.click();
    */
  });
/*********************************************************************************************************/

  it('pouvoir aller à la page Rechercher > Sources', function() {
    browser.get('http://localhost:9000/#/');
      // en cours de construction
  });

/*********************************************************************************************************/
  it('pouvoir aller à la page Rechercher > Flux RSS et lancer une recherche valide', function() {
    browser.get('http://localhost:9000/#/search/rss');

    var searchTerm = element(by.input('searchTerm'));
    searchTerm.clear();
    searchTerm.sendKeys('test search');

    /*
    var button = element(by.button('doAdd()'));
    button.click();
    */
  });
/*********************************************************************************************************/
});
