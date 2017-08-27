GOOS=windows go build -o bin/service-manager.exe 

GOOS=darwin go build -o bin/service-manager.darwin

GOOS=linux go build -o bin/service-manager.linux
