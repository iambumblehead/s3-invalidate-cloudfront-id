s3-invalidate-cloudfront-id
===========================
[![npm version](https://badge.fury.io/js/s3-invalidate-cloudfront-id.svg)](https://badge.fury.io/js/s3-invalidate-cloudfront-id) [![install size](https://packagephobia.now.sh/badge?p=s3-invalidate-cloudfront-id)](https://packagephobia.now.sh/result?p=s3-invalidate-cloudfront-id) 


Simply invalidated the cache for a cloudfront id,
 * **NO** big toolchains,
 * **NO** AWS serverless lambda environment requirement,
 * **NO** overly permissive god-like IAM rules,
 * **NO** un-related packages like vue3 and react,
 * **NO** aws-sdk ~70mb depndency, uses smaller v3 aws client scripts ~3mb
 * **NO** sifting through walls of text to figure out how things work,
 * **NO** writing a wrapper script to use this script, use it from cli


Use this package in your CI pipeline to invalidate cache at the cloudfront id associated with your bucket.
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
