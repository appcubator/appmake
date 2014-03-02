appmake
=======

App on filesystem <-> JSON
JSON -> web app

The format of the app JSON is documented in the wiki.

1. Schema is checked and warnings may be issued
2. Code generators in the JSON are expanded
3. Code from JSON is used to generate a nodejs web application


The resulting web application can be easily deployed on an appcubator server.


Getting started
---------------

Install Grunt and Grunt CLI

cd appmake/
npm install grunt; npm install grunt-cli


Install compass

gem install compass


Building 
--------------

cd appmake/client
grunt build

-- This will clean and create a directory called client/dist which contains statics to be served. Look at Gruntfile.js and grep for "build" for more details on the build process.

Deplying
-----------------


git push deis master