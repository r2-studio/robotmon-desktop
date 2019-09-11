# https://github.com/grpc/grpc-web/releases

# build go
protoc app.proto --go_out=plugins=grpc:../manager/apprpc
# build js
protoc app.proto --js_out=import_style=commonjs:../simple-ui/src/apprpc \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:../simple-ui/src/apprpc