const AWS = require('aws-sdk');
const s3Bucket = new AWS.S3({ accessKeyId: "AKIATRFGPUANKKSWAHFS", secretAccessKey: "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", params: { Bucket: 'saude-tv-contents' } });

module.exports = {
    s3Bucket: s3Bucket,
}
