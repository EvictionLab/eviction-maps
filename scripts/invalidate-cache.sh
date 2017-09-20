#!/bin/bash

export AWS_ACCESS_KEY_ID=$AWS_KEY
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET

aws cloudfront create-invalidation \
    --distribution-id E2B71641SO51XO \
    --paths "/*"
