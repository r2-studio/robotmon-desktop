rm -r releases
mkdir releases

packr -z -v

GOOS=darwin GOARCH=amd64 go build && mv ./main ./releases/simple-manager-drawin
GOOS=linux GOARCH=amd64 go build && mv ./main ./releases/simple-manager-linux
GOOS=windows GOARCH=amd64 go build && mv ./main.exe ./releases/simple-manager-windows.exe
packr clean