s3-invalidate-cloudfront-id
===========================
[![npm version](https://badge.fury.io/js/s3-invalidate-cloudfront-id.svg)](https://badge.fury.io/js/s3-invalidate-cloudfront-id) [![install size](https://packagephobia.now.sh/badge?p=s3-invalidate-cloudfront-id)](https://packagephobia.now.sh/result?p=s3-invalidate-cloudfront-id) 


Simply invalidated the cache for a cloudfront id,
 * Big toolchain: **not required,**
 * AWS serverless lambda environment: **not required,**
 * Overly permissive god-like IAM rules: **not required,**
 * Un-related packages like vue3 and react: **not required,**
 * Lots of reading to understand the point: **not required,**
 * Writing a wrapper script to use this script: **not required**


Use this package in your CI pipeline to invalidate the cache at the cloudfront id associated with your bucket.
```bash
S3_INVALIDATE_CLOUDFRONT_REGION=eu-central-1 \
S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
S3_INVALIDATE_CLOUDFRONT_ID=$AWS_CLOUDFRONT_ID \
s3-invalidate-cloudfront-id
```

An IAM policy like this can be used. Replace `<account-id>` and `<distribution-id>` with valid id values
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "CloudFrontInvalidate",
    "Effect": "Allow",
    "Action": "cloudfront:CreateInvalidation",
    "Resource": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"
  }]
}
```

[@foo-software/s3-directory-sync-cli][0] is an excellent package to use with this one when deploying a static s3+cloudfront site, as seen in the gitlab job template below,
```yaml
job-s3-sync-invalidate-template:
  image: node:latest-alpine
  stage: deploy
  variables:
    # directory sync vars
    S3_DIRECTORY_SYNC_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
    S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
    S3_DIRECTORY_SYNC_BUCKET: $AWS_BUCKET_NAME
    S3_DIRECTORY_SYNC_LOCAL_DIRECTORY: build
    S3_DIRECTORY_SYNC_DRIVE_CONTENT_TYPE: "true"
    # invalidate cache vars
    S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
    S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
    S3_INVALIDATE_CLOUDFRONT_REGION: eu-central-1
    S3_INVALIDATE_CLOUDFRONT_ID: $AWS_CLOUDFRONT_ID
  script:
    - npm ci
    - npx @foo-software/s3-directory-sync-cli
    - npx s3-invalidate-cloudfront-id
```


[0]: https://github.com/foo-software/s3-directory-sync-cli
