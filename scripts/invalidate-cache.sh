#!/bin/bash

export AWS_ACCESS_KEY_ID=$AWS_KEY
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET

aws cloudfront create-invalidation \
    --distribution-id ELMVCLYHTM582 \
    --paths "/index.html"
