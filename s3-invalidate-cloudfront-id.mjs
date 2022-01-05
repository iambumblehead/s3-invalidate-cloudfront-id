import {
  CloudFrontClient,
  CreateInvalidationCommand
} from '@aws-sdk/client-cloudfront';

// option names to local names
const ENV_REGION = 'S3_INVALIDATE_CLOUDFRONT_REGION';
const ENV_ACCESS_KEY_ID = 'S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID';
const ENV_SECRET_ACCESS_KEY = 'S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY';
const ENV_CLOUDFRONT_IDS = 'S3_INVALIDATE_CLOUDFRONT_IDS';

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
//   S3_INVALIDATE_CLOUDFRONT_IDS: '<cloudfrontid>'
// })
export default async opts => {
  const [
    AWS_CLOUDFRONT_IDS,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
  ] = envGet(
    opts,
    ENV_CLOUDFRONT_IDS,
    ENV_REGION,
    ENV_ACCESS_KEY_ID,
    ENV_SECRET_ACCESS_KEY);

  const AWS_CLOUDFRONT_IDS_ARR = (
    Array.isArray(AWS_CLOUDFRONT_IDS)
      ? AWS_CLOUDFRONT_IDS  
      : typeof AWS_CLOUDFRONT_IDS === 'string'
        ? AWS_CLOUDFRONT_IDS.split(',') : []
  ).filter(s => s);

  if (!Array.isArray(AWS_CLOUDFRONT_IDS_ARR) || !AWS_CLOUDFRONT_IDS_ARR.length)
    throw new Error(
      `invalid option: ${ENV_CLOUDFRONT_IDS}: ${AWS_CLOUDFRONT_IDS_ARR}`);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
  const cloudfront = new CloudFrontClient({
    region : AWS_REGION,
    credentials : {
      accessKeyId : AWS_ACCESS_KEY_ID,
      secretAccessKey : AWS_SECRET_ACCESS_KEY
    }
  });

  return Promise.all(AWS_CLOUDFRONT_IDS_ARR.map(cfid => (
    cloudfront.send(new CreateInvalidationCommand({
      DistributionId : cfid,
      InvalidationBatch : {
        CallerReference : `s3-invalidate-cloudfront-id-${cfid}-${Date.now()}`,
        Paths : {
          Quantity : 1,
          Items : [ '/*' ]
        }
      }
    }))
  )));
};
