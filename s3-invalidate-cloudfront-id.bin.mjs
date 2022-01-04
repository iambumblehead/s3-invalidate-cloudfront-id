#! /usr/bin/env node
import invalidateCloudfrontId from './s3-invalidate-cloudfront-id.mjs';

try {
  const res = invaludateCloudfrontId( process.env );

  console.log('[...] invalidation:', JSON.stringify(res, null, '  '));
} catch (e) {
  console.error('Cloudfront Error!!');
  console.error(`Code: ${e.code}`);
  console.error(`Message: ${e.message}`);
  console.error(`AWS Request ID: ${e.requestId}`);

  throw new Error('Cloudfront invalidation failed!');
}
