const AWS = require("aws-sdk");
const s3Bucket = new AWS.S3();

module.exports = {
  s3Bucket: s3Bucket,
};
