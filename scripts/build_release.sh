#!/bin/sh
# Use this script for building docker images before create a new release
npm i -g turbo
npm i -g typeorm
npm ci
docker compose build db
npm run codegen
npm run build
npm run d:multi