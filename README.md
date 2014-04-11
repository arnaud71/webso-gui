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

0. Before you begin testing, please install this modules with NPM, if this is not done : 

	npm install karma@0.12.1

1. Run unit tests - midway test and generate the rate of code coverage

	2.1 Before you begin start and run, please install this module with NPM, if this is not done : 

		npm install karma-coverage

		npm install ng-midway-tester

	2.2 Run :	

		grunt test

2. Run e2e test

	3.1 Before you begin to run, please install this module with NPM, if this is not done : 
	
		npm install -g protractor

	3.2 download "chromedriver" and "selenium" :
		
		here in Append X section : https://github.com/angular/protractor

	3.3 Start Chrome driver :
		
		chmod +x path_to_chromedriver
		
		./path_to_chromedriver

	3.4 Start Selenium server :

		java -jar path_to_selenium-server-standalone-2.40.0.jar -Dwebdriver.chrome.driver="path_to_chromedriver"

	3.5 Run test :

		protractor karma-e2e.conf.js