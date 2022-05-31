const AWS = require('aws-sdk');
const s3Bucket = new AWS.S3({ accessKeyId: "AKIAWWBGSOE34MU3INJ6", secretAccessKey: "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", params: { Bucket: 'saude-tv-contents' } });

module.exports = {
    s3Bucket: s3Bucket,
}
