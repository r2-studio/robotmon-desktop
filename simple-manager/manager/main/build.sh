tag=`git describe --tags HEAD`

rm -r releases
mkdir releases

packr -z -v
GOOS=darwin GOARCH=amd64 go build && mv ./main ./releases/simple-manager-drawin-$tag
GOOS=linux GOARCH=amd64 go build && mv ./main ./releases/simple-manager-linux-$tag
GOOS=windows GOARCH=amd64 go build && mv ./main.exe ./releases/simple-manager-windows-$tag.exe
packr clean