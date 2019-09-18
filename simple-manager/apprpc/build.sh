# https://github.com/grpc/grpc-web/releases

# build go
protoc app.proto --go_out=plugins=grpc:../manager/apprpc
# build js
protoc app.proto --js_out=import_style=commonjs:../simple-ui/src/apprpc \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:../simple-ui/src/apprpc
# build service js
protoc grpc.proto --js_out=import_style=commonjs:../simple-ui/src/apprpc \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:../simple-ui/src/apprpc

sed -i '' '1i\
\/* eslint-disable *\/
' ../simple-ui/src/apprpc/app_grpc_web_pb.js

sed -i '' '1i\
\/* eslint-disable *\/
' ../simple-ui/src/apprpc/app_pb.js

sed -i '' '1i\
\/* eslint-disable *\/
' ../simple-ui/src/apprpc/grpc_grpc_web_pb.js

sed -i '' '1i\
\/* eslint-disable *\/
' ../simple-ui/src/apprpc/grpc_pb.js
