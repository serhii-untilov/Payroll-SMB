@ECHO OFF
CHCP 1251 > NULL

npm --workspace=@repo/shared run build
npm --workspace=@repo/api run build
npm run db
rm -rf packages\openapi\src
npm --workspace=@repo/api run codegen

npx openapi-generator-cli generate -i ./apps/api/swagger.json -o ./packages/openapi/src \
    -g typescript-axios \
    --type-mappings=DateTime=Date
