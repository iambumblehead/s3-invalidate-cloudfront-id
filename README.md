s3-invalidate-cloudfront-id
===========================

Simply invalidated the cache for a cloudfront id,
 * Big toolchain: **not required,**
 * AWS serverless lambda environment: **not required,**
 * Overly permissive god-like IAM rules: **not required,**
 * Un-related packages like vue3 and react: **not required,**
 * Lots of reading to understand the point: **not required,**
 * Writing a wrapper script to use this script: **not required**


Use this package in your CI pipeline to invalidate the cache at the cloudfront id associated with your bucket.

[@foo-software/s3-directory-sync-cli][0] is an excellent package to use in tandem with this one, if you're deploying a static s3/cloudfront site,
```bash
# directory sync vars
S3_DIRECTORY_SYNC_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
S3_DIRECTORY_SYNC_BUCKET=$AWS_BUCKET_NAME
S3_DIRECTORY_SYNC_LOCAL_DIRECTORY=build

# invalidate cache vars
S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
S3_INVALIDATE_CLOUDFRONT_ID=$AWS_CLOUDFRONT_ID

npx @foo-software/s3-directory-sync-cli
npx s3-invalidate-cloudfront-id
```


[0]: https://github.com/foo-software/s3-directory-sync-cli
