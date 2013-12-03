mv tmp/appcode/node_modules bckupppp
rm -rf tmp
mkdir tmp
./appmake.js parse tests/flickrpickr/ tmp/flick.json
./appmake.js compile tmp/flick.json tmp/appcode
mv bckupppp tmp/appcode/node_modules
cd tmp/appcode && MONGO_ADDR=mongodb://localhost/test node app.js
