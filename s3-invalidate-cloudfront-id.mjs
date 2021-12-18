import {
  CloudFrontClient,
  CreateInvalidationCommand
} from '@aws-sdk/client-cloudfront';

// option names to local names
const ENV = process.env;
const ENV_REGION = 'S3_INVALIDATE_CLOUDFRONT_REGION';
const ENV_ACCESS_KEY_ID = 'S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID';
const ENV_SECRET_ACCESS_KEY = 'S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY';
const ENV_CLOUDFRONT_ID = 'S3_INVALIDATE_CLOUDFRONT_ID';

const envGet = (...opts) => {
  const definedOpts = opts.map(opt => ENV[opt]).filter(o => o);

  if (definedOpts.length !== opts.length)
    throw new Error(
      'missing options: ' + opts.filter(opt => !ENV[opt]).join(', '));

  return definedOpts;
};

const invalidateCache = async () => {
  if (process.npm_package_name && process.npm_package_version)
    console.log(`${process.npm_package_name}@${process.npm_package_version}`);

  const [
    AWS_CLOUDFRONT_ID,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
  ] = envGet(
    ENV_CLOUDFRONT_ID, ENV_REGION, ENV_ACCESS_KEY_ID, ENV_SECRET_ACCESS_KEY);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
  const cloudfront = new CloudFrontClient({
    region : AWS_REGION,
    credentials : {
      accessKeyId : AWS_ACCESS_KEY_ID,
      secretAccessKey : AWS_SECRET_ACCESS_KEY
    }
  });

  try {
    const res = await cloudfront.send(new CreateInvalidationCommand({
      DistributionId : AWS_CLOUDFRONT_ID,
      InvalidationBatch : {
        CallerReference : `s3-invalidate-cloudfront-id-${Date.now()}`,
        Paths : {
          Quantity : 1,
          Items : [ '/*' ]
        }
      }
    }));

    console.log('[...] invalidation:', JSON.stringify(res, null, '  '));
  } catch(e) {
    console.error('Cloudfront Error!!');
    console.error(`Code: ${e.code}`);
    console.error(`Message: ${e.message}`);
    console.error(`AWS Request ID: ${e.requestId}`);

    throw new Error('Cloudfront invalidation failed!');
  };
};

invalidateCache();
