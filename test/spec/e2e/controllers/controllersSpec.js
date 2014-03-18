//
// test/e2e/controllers/controllersSpec.js
//
describe("Integration/E2E Testing", function() {

  // start at root before every test is run
  beforeEach(function() {
    browser().navigateTo('/');
   // "http://localhost:8080/#/"
  });
/*********************************************************************************************************/
  it('pouvoir aller à la page de log in', function() {
    browser().navigateTo('#/signin');
    expect(browser().location().path()).toBe("/signin");
 	});
/*********************************************************************************************************/
  it('pouvoir aller à la page Valider > Ajouter information et ajouter une information valide', function() {
    browser().navigateTo('#/validate/add');
    expect(browser().location().path()).toBe("/validate/add");
    input('inputTitle').enter('un test titre');
    input('inputUrl').enter('http://www.google.fr');
    input('inputTags').enter('un test tag');
    input('inputDetails').enter('un test details');
    element(':button').click();
  });
/*********************************************************************************************************/
  it('pouvoir aller à la page Valider > Afficher informations validées', function() {
    browser().navigateTo('#/validate/display');
    expect(browser().location().path()).toBe("/validate/display");
    expect(repeater('tr td').count()).toEqual(0);
  });
/*********************************************************************************************************/
  it('pouvoir aller à la page Surveiller > Ajouter une surveillance et ajouter une surveillance valide', function() {
    browser().navigateTo('#/watch/add');
    expect(browser().location().path()).toBe("/watch/add");
//  input('inputSource').enter('un test titre'); champ "name" non existant
    input('inputTitle').enter('un test titre');
    input('inputTags').enter('un test tag');   
// choisir le dossier de surveillance. c'est un menu de choix
// choisir le domaine de surveillance. c'est un menu de choix
// choisir le secteur d'activité pour la surveillance. c'est un menu de choix
/*
    input('inputRequete').enter('test requete'); champ "name" non existant
    element(':btn').click();
*/
// choisir une frequence pour la surveillance. c'est un menu de choix
// choisir le mode de notification pour la surveillance. c'est un menu de choix
    element(':button').click();  
  });
/*********************************************************************************************************/
  it('pouvoir aller à la page Surveiller > Ajouter une source et ajouter une source valide', function() {
    browser().navigateTo('#/source/sourceAdd');
    expect(browser().location().path()).toBe("/source/sourceAdd");
    input('inputUrl').enter('http://www.google.fr');
    input('inputTitle').enter('un test titre');
    input('inputTags').enter('un test tag');
    element(':button').click();
  });
/*********************************************************************************************************/
  
  it('pouvoir aller à la page Surveiller > Afficher les sources', function() {
    browser().navigateTo('#/watch/sourceslist');
    expect(browser().location().path()).toBe("/watch/sourceslist");
    expect(repeater('tr td').count()).toEqual(0);
  });

/*********************************************************************************************************/
  
  it('pouvoir aller à la page Surveiller > Afficher les surveillances', function() {
    browser().navigateTo('#/watch/watchList');
    expect(browser().location().path()).toBe("/watch/watchList");
    expect(repeater('tr td').count()).toEqual(0);
  });
  
/*********************************************************************************************************/
  it('pouvoir aller à la page Diffuser > Newsletter et diffuser une newsletter valide', function() {
    browser().navigateTo('#/publish/newsletter');
    expect(browser().location().path()).toBe("/publish/newsletter");
//  input('inputTitle').enter('un test titre'); champ "name" non existant
//  input('inputEmail').enter('un test de mail'); chapm "name" non existant
//  choisir la date d'envoie c'est en format spécial
//  choisir une frequence d'envoie. c'est un menu de choix
//  choisir le dossier de validation. c'est un menu de choix
   element(':button').click();  
  });
/*********************************************************************************************************/
  it('pouvoir aller à la page Diffuser > Rapport et diffuser un rapport valide', function() {
    browser().navigateTo('#/publish/report');
    expect(browser().location().path()).toBe("/publish/report");
    input('inputTitle').enter('un test titre');
//  choisir le format du rapport. c'est un menu de choix 
//  selection de dossier de validation. c'est un menu de choix 
    element(':button').click();
  });
/*********************************************************************************************************/

  it('pouvoir aller à la page Organiser > Dossiers de surveillance', function() {
      // en cours de construction
  });

/*********************************************************************************************************/

  it('pouvoir aller à la page Organiser > Dossiers de validation', function() {
    browser().navigateTo('#/organize/vfolder');
    expect(browser().location().path()).toBe("/organize/vfolder");
    expect(repeater('tr td').count()).toEqual(0);
  });

/*********************************************************************************************************/

  it('pouvoir aller à la page Organiser > Templates', function() {
      // en cours de construction
  });

/*********************************************************************************************************/

  it('pouvoir aller à la page Organiser > Collectes webso', function() {
      // en cours de construction
  });

/*********************************************************************************************************/
 
  it('pouvoir aller à la page Organiser > Packages de sources', function() {
      // en cours de construction
  });

/*********************************************************************************************************/  
  it('pouvoir aller à la page Organiser > Profils et ajouter un profil valide', function() {
    browser().navigateTo('#/organize/profile');
    expect(browser().location().path()).toBe("/organize/profile");
//  input('inputNom').enter('un test Nom');
//  input('inputPrenom').enter('un test Prenom');
//  input('inputEmail').enter('un test Email');
//  input('inputPassword').enter('un test Password');
    element(':button').click();
  });
/*********************************************************************************************************/

  it('pouvoir aller à la page Tableau de bord', function() {
      // en cours de construction
  });

/*********************************************************************************************************/
  
  it('pouvoir aller à la page Rechercher > Dossiers', function() {
      // en cours de construction
  });

/*********************************************************************************************************/
  it('pouvoir aller à la page Rechercher > Collectes webso et lancer une recherche valide', function() {
    browser().navigateTo('#/search/webso');
    expect(browser().location().path()).toBe("/search/webso");
//  input('inputSearch').enter('un test de mots-cles');
    element(':button').click();
  });
/*********************************************************************************************************/

  it('pouvoir aller à la page Rechercher > Sources', function() {
      // en cours de construction
  });

/*********************************************************************************************************/
  it('pouvoir aller à la page Rechercher > Flux RSS et lancer une recherche valide', function() {
    browser().navigateTo('#/search/rss');
    expect(browser().location().path()).toBe("/search/rss");
//  input('inputRSS').enter('un test de mots-cles');
    element(':button').click();
  });
/*********************************************************************************************************/
});
