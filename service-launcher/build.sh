VERSION="v0.5"
astilectron-bundler -v

cd output/darwin-amd64
electron-installer-dmg "Robotmon Service Manager.app" "Robotmon Service Manager" --icon=../../resources/icon.icns
mv "Robotmon Service Manager.dmg" "../Robotmon-Service-Manager-$VERSION-mac.dmg"
cd ../linux-amd64
zip -r "../Robotmon-Service-Manager-$VERSION-linux.zip" "Robotmon Service Manager"
cd ../windows-386
zip -r "../Robotmon-Service-Manager-$VERSION-win32.zip" "Robotmon Service Manager.exe"
cd ../windows-amd64
zip -r "../Robotmon-Service-Manager-$VERSION-win64.zip" "Robotmon Service Manager.exe"

cd ..
rm -rf darwin-amd64
rm -rf linux-amd64
rm -rf windows-386
rm -rf windows-amd64