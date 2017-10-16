GOOS=windows GOARCH=amd64 go build -o bin/win64/service-manager.windows service-manager.go
GOOS=windows GOARCH=amd64 go build -o bin/win64/start.exe start.go
GOOS=windows GOARCH=amd64 go build -o bin/win64/start-vm.exe start-vm.go
GOOS=windows GOARCH=amd64 go build -o bin/win64/stop.exe stop.go

GOOS=windows GOARCH=386 go build -o bin/win32/service-manager.windows service-manager.go
GOOS=windows GOARCH=386 go build -o bin/win32/start.exe start.go
GOOS=windows GOARCH=386 go build -o bin/win32/start-vm.exe start-vm.go
GOOS=windows GOARCH=386 go build -o bin/win32/stop.exe stop.go 

GOOS=darwin go build -o bin/mac/service-manager.darwin service-manager.go
GOOS=darwin go build -o bin/mac/start start.go
GOOS=darwin go build -o bin/mac/stop stop.go

GOOS=linux go build -o bin/linux/service-manager.linux service-manager.go
GOOS=linux go build -o bin/linux/start start.go
GOOS=linux go build -o bin/linux/stop stop.go 

zip -r service-manager.zip bin