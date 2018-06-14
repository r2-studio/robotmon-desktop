version=`grep -o '"version": *"[^"]*' manifest.json | grep -o '[^"]*$'`
mkdir output
zip -r "output/Robotmon-Messenger-v$version.zip" .
