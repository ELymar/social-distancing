TIME=$(date +%s)
ARTIFACT_DIR=deploy/$TIME
# Compile
echo Compiling...
tsc
# Copy assets
echo Copying assets to $ARTIFACT_DIR ...
mkdir -p $ARTIFACT_DIR
cp -R build $ARTIFACT_DIR
cp index.html $ARTIFACT_DIR
cp -R assets $ARTIFACT_DIR

# Zip
echo Compressing...
pushd $ARTIFACT_DIR
zip -r ../$TIME.zip ./* -x "*.DS_Store"
popd

# Clean
echo Cleaning...
rm -rf $ARTIFACT_DIR

echo Build artifacts complete: $ARTIFACT_DIR


