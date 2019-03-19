VERSION="v1.1"

GOOS=darwin GOARCH=amd64 go build -ldflags "-X main.VERSION=$VERSION" -o release/light-manager-mac
GOOS=linux GOARCH=amd64 go build -ldflags "-X main.VERSION=$VERSION" -o release/light-manager-linux
GOOS=windows GOARCH=386 go build -ldflags "-X main.VERSION=$VERSION" -o release/light-manager-win32.exe
GOOS=windows GOARCH=amd64 go build -ldflags "-X main.VERSION=$VERSION" -o release/light-manager-win64.exe

cd release
zip light-manager-$VERSION-mac.zip light-manager-mac
zip light-manager-$VERSION-linux.zip light-manager-linux
zip light-manager-$VERSION-win32.zip light-manager-win32.exe
zip light-manager-$VERSION-win64.zip light-manager-win64.exe

rm light-manager-mac
rm light-manager-linux
rm light-manager-win32.exe
rm light-manager-win64.exe