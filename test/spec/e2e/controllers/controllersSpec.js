//
// test/e2e/controllers/controllersSpec.js
//
describe("Integration/E2E Testing", function() {

  beforeEach(function() {
    ptor = protractor.getInstance();
  });


/********************************** fonctionnel (Enregistrement) *******************************/

 it('pouvoir aller à la page d\'enregistrement', function() {
    browser.get('http://localhost:9000/#/publicRegister');
    expect(ptor.getLocationAbsUrl()).toBe('http://localhost:9000/#/publicRegister');
    
    var inputNomUser = element(by.name('username'));
    inputNomUser.clear();
    inputNomUser.sendKeys('test_nom_utilisateur');
        
    var inputMotDePasse = element(by.name('password'));
    inputMotDePasse.clear();
    inputMotDePasse.sendKeys('mot_de_passe');

    var button = element(by.name('register'));
    button.click();
 });

/********************************** fonctionnel (Log in - deconnection) ***************************************/

 it('pouvoir aller à la page de log in', function() {
    // fonctionnel (log in)
    browser.get('http://localhost:9000/#/login');
    expect(ptor.getLocationAbsUrl()).toBe('http://localhost:9000/#/login');
    
    var inputNomUser = element(by.name('username'));
    inputNomUser.clear();
    inputNomUser.sendKeys('test_nom_utilisateur');
        
    var inputMotDePasse = element(by.name('password'));
    inputMotDePasse.clear();
    inputMotDePasse.sendKeys('mot_de_passe');

    var button = element(by.name('connection'));
    button.click();
    ptor.waitForAngular();

    expect(ptor.getLocationAbsUrl()).toBe('http://localhost:9000/#/home');
 });
/********************************************************************************************************************/
});
