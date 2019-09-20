tag=`git describe --tags HEAD | sed -e 's/\./-/g'`

rm -r releases
mkdir releases

packr -z -v
GOOS=darwin GOARCH=amd64 go build && mv ./main ./releases/simple-manager-$tag-drawin
GOOS=linux GOARCH=amd64 go build && mv ./main ./releases/simple-manager-$tag-linux
GOOS=windows GOARCH=amd64 go build && mv ./main.exe ./releases/simple-manager-$tag-windows.exe
packr clean