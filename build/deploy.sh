#!/bin/bash
TOOL_BUCKET=eviction-lab-tool-staging
MAP_BUCKET=eviction-lab-map-staging
RANKINGS_BUCKET=eviction-lab-rankings-staging
CLOUDFRONT_ID=$CLOUDFRONT_ID_DEV

if [ "$TRAVIS_BRANCH" = "master" ]; then
    TOOL_BUCKET=eviction-lab-tool
    MAP_BUCKET=eviction-lab-map
    RANKINGS_BUCKET=eviction-lab-rankings
    CLOUDFRONT_ID=$CLOUDFRONT_ID_PROD
fi

aws s3 cp dist/ s3://$TOOL_BUCKET/tool --acl=public-read --recursive --cache-control max-age=604800
aws s3 cp dist/index.html s3://$MAP_BUCKET/map/index.html --acl=public-read --cache-control max-age=3600

node ./build/update-metadata.js
aws s3 cp dist/index.html s3://$RANKINGS_BUCKET/rankings/index.html --acl=public-read --cache-control max-age=3600

aws cloudfront create-invalidation --distribution-id=$CLOUDFRONT_ID --paths="/*"
