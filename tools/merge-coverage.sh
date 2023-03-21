#!/bin/sh

TEMP_MERGED_FILE=tmp/merged-coverage.json

mkdir -p tmp/{coverage,merged}

npx nx run-many --target=test --all --codeCoverage

rm -rf tmp/{coverage,merged}/*
rm -rf $TEMP_MERGED_FILE

for file in $(find coverage -name coverage-final.json); do
    cp $file tmp/coverage/$(echo $file | cut -f3,4 -d'/' | sed -E 's/\//-/g').json
done

npx nyc merge tmp/coverage $TEMP_MERGED_FILE

npx nyc report -t tmp/coverage --report-dir tmp/merged --reporter=html