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
    npm install -g grunt; npm install -g grunt-cli
    cd client/
    npm install



Building
--------

    sh build.sh



Deploying
---------

    ./push_statics.sh
    git push deis master
