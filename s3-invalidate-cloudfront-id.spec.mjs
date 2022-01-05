import test from 'ava';
import esmock from 'esmock';

const resSuccess = {
  $metadata : {
    httpStatusCode : 201,
    requestId : '6bdd5041-6a0c-4fac-ab9f-162306b51c4e',
    attempts : 1,
    totalRetryDelay : 0
  },
  Invalidation : {
    Id : '<invalidation-id>',
    Status : 'InProgress',
    CreateTime : '2022-01-04T21:20:32.353Z',
    InvalidationBatch : {
      Paths : {
        Quantity : 1,
        Items : [
          '/*'
        ]
      },
      CallerReference : 's3-invalidate-cloudfront-id-1641331231405'
    }
  },
  Location : [
    'https://cloudfront.amazonaws.com/2020-05-31',
    'distribution/<distribution-id>',
    'invalidation/<invalidation-id>' ].join('/')
};

test('should return response from AWS', async t => {
  function CloudFrontClient () {
    this.send = () => resSuccess;    
  }
  
  const invalidateCloudfrontId = await esmock(
    './s3-invalidate-cloudfront-id.mjs', {
      '@aws-sdk/client-cloudfront' : { CloudFrontClient }
    });

  t.deepEqual(await invalidateCloudfrontId({
    S3_INVALIDATE_CLOUDFRONT_REGION : 'eu-central-1',
    S3_INVALIDATE_CLOUDFRONT_ACCESS_KEY_ID : '<bucketid>',
    S3_INVALIDATE_CLOUDFRONT_SECRET_ACCESS_KEY : '<bucketsecret>',
    S3_INVALIDATE_CLOUDFRONT_IDS : '<cloudfrontid>' 
  }), [ resSuccess ]);
});
