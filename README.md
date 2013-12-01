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

In an empty directory, cd and run:

    ./appmake.js compile examples.flickrpics .

To run,

    node app.js

To deploy, run the following command. Note that it will ask you to authenticate:

    ./appmake.js deploy .


