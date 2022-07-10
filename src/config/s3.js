const AWS = require("aws-sdk");
const s3Bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

module.exports = {
  s3Bucket: s3Bucket,
};
