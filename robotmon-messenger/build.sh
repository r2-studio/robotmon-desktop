version=`grep -o '"version": *"[^"]*' manifest.json | grep -o '[^"]*$'`
rm -rf output
mkdir output
zip -x "output/*" -r "output/Robotmon-Messenger-v$version.zip" .
