PROTOC_GEN_TS_PATH="../../node_modules/ts-protoc-gen/bin/protoc-gen-ts"
 
OUT_DIR="./"
 
protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=true:${OUT_DIR}" \
    grpc.proto