VERSION="v0.2"
astilectron-bundler -v

zip -r "output/Robotmon-Service-Manager-$VERSION-mac" "output/darwin-amd64/Robotmon Service Manager.app"
zip -r "output/Robotmon-Service-Manager-$VERSION-linux" "output/linux-amd64/Robotmon Service Manager"
zip -r "output/Robotmon-Service-Manager-$VERSION-win32" "output/windows-386/Robotmon Service Manager.exe"
zip -r "output/Robotmon-Service-Manager-$VERSION-win64" "output/windows-amd64/Robotmon Service Manager.exe"