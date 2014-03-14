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

1. Run unit tests
	1.1 Start Karma :
		karma start karma-unit.conf.js
	
	1.2 Run test	
		karma run karma-unit.conf.js

2. Run midway test
	1.1 Start Karma :
		karma start karma-midway.conf.js
	
	1.2 Run test	
		karma run karma-midway.conf.js

3. Run e2e test
	1.1 Start Karma :
		karma start karma-e2e.conf.js
	
	1.2 Run test	
		karma run karma-e2e.conf.js
