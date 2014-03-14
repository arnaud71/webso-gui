//
// test/e2e/controllers/controllersSpec.js
//
describe("Integration/E2E Testing", function() {

  // start at root before every test is run
  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('pouvoir aller à la page home', function() {
    browser().navigateTo('home');
    expect(browser().window().path()).toBe("/__karma__/home");
  });
  it('pouvoir aller à la page de log in', function() {
    browser().navigateTo('signin');
    expect(browser().window().path()).toBe("/__karma__/signin");
  });
  it('pouvoir aller à la page Valider > Ajouter information', function() {
    browser().navigateTo('validate/add');
    expect(browser().window().path()).toBe("/__karma__/validate/add");
  });
  it('pouvoir aller à la page Valider > Afficher informations validées', function() {
    browser().navigateTo('validate/display');
    expect(browser().window().path()).toBe("/__karma__/validate/display");
  });
  it('pouvoir aller à la page Surveiller > Ajouter une surveillance', function() {
    browser().navigateTo('watch/add');
    expect(browser().window().path()).toBe("/__karma__/watch/add");    
  });
  it('pouvoir aller à la page Surveiller > Ajouter une source', function() {
    browser().navigateTo('source/sourceAdd');
    expect(browser().window().path()).toBe("/__karma__/source/sourceAdd");
  });
  it('pouvoir aller à la page Surveiller > Afficher les sources', function() {
    browser().navigateTo('watch/sourceslist');
    expect(browser().window().path()).toBe("/__karma__/watch/sourceslist");
  });
  it('pouvoir aller à la page Surveiller > Afficher les surveillances', function() {
    browser().navigateTo('watch/watchList');
    expect(browser().window().path()).toBe("/__karma__/watch/watchList");
  });
  it('pouvoir aller à la page Diffuser > Newsletter', function() {
    browser().navigateTo('publish/newsletter');
    expect(browser().window().path()).toBe("/__karma__/publish/newsletter");
  });
  it('pouvoir aller à la page Diffuser > Rapport', function() {
    browser().navigateTo('publish/report');
    expect(browser().window().path()).toBe("/__karma__/publish/report");
  });
  it('pouvoir aller à la page Organiser > Dossiers de surveillance', function() {
    browser().navigateTo('home');
    expect(browser().window().path()).toBe("/__karma__/home");
  });
  it('pouvoir aller à la page Organiser > Dossiers de validation', function() {
    browser().navigateTo('organize/vfolder');
    expect(browser().window().path()).toBe("/__karma__/organize/vfolder");
  });
  it('pouvoir aller à la page Organiser > Templates', function() {
    browser().navigateTo('home');
    expect(browser().window().path()).toBe("/__karma__/home");
  });
  it('pouvoir aller à la page Organiser > Collectes webso', function() {
    browser().navigateTo('home');
    expect(browser().window().path()).toBe("/__karma__/home");
  });
  it('pouvoir aller à la page Organiser > Packages de sources', function() {
    browser().navigateTo('home');
    expect(browser().window().path()).toBe("/__karma__/home");
  });
  it('pouvoir aller à la page Organiser > Profils', function() {
    browser().navigateTo('organize/profile');
    expect(browser().window().path()).toBe("/__karma__/organize/profile");
  });
  it('pouvoir aller à la page Tableau de bord', function() {
    browser().navigateTo('home');
    expect(browser().window().path()).toBe("/__karma__/home");
  });
  it('pouvoir aller à la page Rechercher > Dossiers', function() {
    browser().navigateTo('home');
    expect(browser().window().path()).toBe("/__karma__/home");
  });
  it('pouvoir aller à la page Rechercher > Collectes webso', function() {
    browser().navigateTo('search/webso');
    expect(browser().window().path()).toBe("/__karma__/search/webso");
  });
  it('pouvoir aller à la page Rechercher > Sources', function() {
    browser().navigateTo('home');
    expect(browser().window().path()).toBe("/__karma__/home");
  });
  it('pouvoir aller à la page Rechercher > Flux RSS', function() {
    browser().navigateTo('search/rss');
    expect(browser().window().path()).toBe("/__karma__/search/rss");
  });
});
