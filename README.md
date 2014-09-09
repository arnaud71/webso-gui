Webso GUI
==========

Webso GUI is the last version of GUI part of Webso

Install
-------

0. First time

        you have to pre-install some software on your computer, see next section (pre-install)

1. Clone a copy of webso-gui

        git clone https://github.com/arnaud71/webso-gui.git

2. In webso-gui project init npm

        npm install


3. And reload dependancies (such as angular ones)

        bower install

4. Run the web server

        grunt server

Pre-install
-----------

1. node.js

        Go to http://howtonode.org/how-to-install-nodejs

2. install yeoman

        npm install -g yo (http://yeoman.io/)


Run the tests 
-------------

0. Run unit tests - midway test and generate the rate of code coverage

		grunt test

1. Run e2e test

	2.1 download "chromedriver" and "selenium" :
		
		here in Append X section : https://github.com/angular/protractor

	2.2 Start Selenium server :

		java -jar path_to_selenium-server-standalone-2.40.0.jar -Dwebdriver.chrome.driver="path_to_chromedriver"
		
	2.3 Start Chrome driver  :

		chmod +x path_to_chromedriver
		
		./path_to_chromedriver

	2.4 Run test :

		protractor protractor-e2e.conf.js


Installation on the server:
---------------------------


0. on client side do:

grunt build (to update the dist directory)


1. on server side do:

mv webso-gui webso-gui-save-n
ftp dist to webso-gui

change script/cfg.js
comment lines

  urlDB               : 'http://localhost:8983/',
  urlServices         : 'http://localhost/cgi-bin/webso-services/',
  urlBookmarklet      : ‘',

and uncomment lines

 //urlDB           : 'http://albator.hesge.ch:8983/',
  //urlServices     : 'http://albator.hesge.ch/cgi-bin/webso-services/',
  //urlBookmarklet  : 'http://albator.hesge.ch/web/webso-gui/'