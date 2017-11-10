VERSION="v0.2"
#astilectron-bundler -v

cd output/darwin-amd64
zip -r "../Robotmon-Service-Manager-$VERSION-mac.zip" "Robotmon Service Manager.app"
cd ../linux-amd64
zip -r "../Robotmon-Service-Manager-$VERSION-linux.zip" "Robotmon Service Manager"
cd ../windows-386
zip -r "../Robotmon-Service-Manager-$VERSION-win32.zip" "Robotmon Service Manager.exe"
cd ../windows-amd64
zip -r "../Robotmon-Service-Manager-$VERSION-win64.zip" "Robotmon Service Manager.exe"
