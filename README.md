s3-invalidate-cloudfront-id
===========================
[![npm version](https://badge.fury.io/js/s3-invalidate-cloudfront-id.svg)](https://badge.fury.io/js/s3-invalidate-cloudfront-id) [![install size](https://packagephobia.now.sh/badge?p=s3-invalidate-cloudfront-id)](https://packagephobia.now.sh/result?p=s3-invalidate-cloudfront-id) 


Simply invalidate cache for one or more cloudfront ids,
 * **NO** big toolchains,
 * **NO** required wrapper script, use it from cli,
 * **NO** required of AWS serverless lambda environment,
 * **NO** overly permissive god-like IAM rules,
 * **NO** un-related packages, such as vue3 or react,
 * **NO** ~70mb aws-sdk dependency, uses ~4mb v3 aws scripts,
 * **NO** sifting through walls of text to figure out how it works


Use this package in your CI pipeline to invalidate cache at the cloudfront ids associated with your bucket.
```bash
S3_INVALIDATE_CLOUDFRONT_REGION=eu-central-1 \
S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
S3_INVALIDATE_CLOUDFRONT_IDS=E29BKF76GZ5 \ # one or more, comma-seprated
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
    S3_INVALIDATE_CLOUDFRONT_IDS: E29BKF76GZ5,E88BC7S3S5
  script:
    - npm ci
    - npx @foo-software/s3-directory-sync-cli
    - npx s3-invalidate-cloudfront-id
```


The purpose of `s3-invalidate-cloudfront-id` is to avoid necessity of wrapper scripts, however, it can be used from another script if wanted,
``` javascript
import invalidateCloudfrontId from 's3-invalidate-cloudfront-id';

const awsRes = await invaludateCloudfrontId({
  S3_INVALIDATE_CLOUDFRONT_REGION: '<region>',
  S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID: '<bucketid>',
  S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY: '<bucketsecret>',
  S3_INVALIDATE_CLOUDFRONT_IDS: '<cloudfrontid>,<cloudfrontid>'
});
```



[0]: https://github.com/foo-software/s3-directory-sync-cli
