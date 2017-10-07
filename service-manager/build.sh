GOOS=windows go build -o bin/windows/service-manager.windows service-manager.go
GOOS=darwin go build -o bin/mac/service-manager.darwin service-manager.go
GOOS=linux go build -o bin/linux/service-manager.linux service-manager.go

GOOS=windows go build -o bin/windows/start.exe start.go
GOOS=darwin go build -o bin/mac/start start.go
GOOS=linux go build -o bin/linux/start start.go

GOOS=windows go build -o bin/windows/stop.exe stop.go 
GOOS=darwin go build -o bin/mac/stop stop.go 
GOOS=linux go build -o bin/linux/stop stop.go 

zip -r service-manager.zip bin