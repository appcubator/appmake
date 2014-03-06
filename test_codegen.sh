set -e
SCRIPTPATH=$( cd $(dirname $0) ; pwd -P )
cd $SCRIPTPATH
OUTDIR=`pwd`/tmp

# BACKUP NODE MODULES
NODEMODULES=$OUTDIR/compiled/node_modules
NMBACKUP=$TMPDIR/node_modules
if [ -d $NODEMODULES ]; then
    mv $NODEMODULES $NMBACKUP
fi

# CLEAN PREVIOUS WORK
rm -r -f $OUTDIR
mkdir -p $OUTDIR

# COMPILE APP
./appmake.js parse tests/flickrpickr/ $OUTDIR/parsed.json
./appmake.js compile $OUTDIR/parsed.json $OUTDIR/compiled

cd $OUTDIR/compiled

# RESTORE BACKUP OF NODE MODULES
if [ -d $NMBACKUP ]; then
    mv $NMBACKUP $NODEMODULES
else
    npm install
fi

# RUN APP
echo -e "\nYour app is running! http://localhost:3001/\n"
MONGO_ADDR=mongodb://localhost/test node --debug app.js 3001
