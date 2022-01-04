import {
  CloudFrontClient,
  CreateInvalidationCommand
} from '@aws-sdk/client-cloudfront';

// option names to local names
const ENV_REGION = 'S3_INVALIDATE_CLOUDFRONT_REGION';
const ENV_ACCESS_KEY_ID = 'S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID';
const ENV_SECRET_ACCESS_KEY = 'S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY';
const ENV_CLOUDFRONT_ID = 'S3_INVALIDATE_CLOUDFRONT_ID';

const envGet = (opts, ...optNames) => {
  const definedOpts = optNames.map(name => opts[name]).filter(o => o);

  if (definedOpts.length !== optNames.length)
    throw new Error(
      'missing options: ' + optNames.filter(name => !opts[name]).join(', '));

  return definedOpts;
};

// ex,
// invalidateCloudfrontId({
//   S3_INVALIDATE_CLOUDFRONT_REGION: '<region>',
//   S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID: '<bucketid>',
//   S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY: '<bucketsecret>',
//   S3_INVALIDATE_CLOUDFRONT_ID: '<cloudfrontid>'
// })
export default async opts => {
  const [
    AWS_CLOUDFRONT_ID,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
  ] = envGet(
    opts,
    ENV_CLOUDFRONT_ID,
    ENV_REGION,
    ENV_ACCESS_KEY_ID,
    ENV_SECRET_ACCESS_KEY);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
  const cloudfront = new CloudFrontClient({
    region : AWS_REGION,
    credentials : {
      accessKeyId : AWS_ACCESS_KEY_ID,
      secretAccessKey : AWS_SECRET_ACCESS_KEY
    }
  });

  return cloudfront.send(new CreateInvalidationCommand({
    DistributionId : AWS_CLOUDFRONT_ID,
    InvalidationBatch : {
      CallerReference : `s3-invalidate-cloudfront-id-${Date.now()}`,
      Paths : {
        Quantity : 1,
        Items : [ '/*' ]
      }
    }
  }));
};
