const { s3Bucket } = require("../config/s3");
const AWS = require("aws-sdk");
const AmazonS3URI = require("amazon-s3-uri");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadBase64 = async (bucket, fileName, file, typeFile) => {
  let buffer = ""
  if (typeFile === "image") {
    buffer = Buffer.from(
      file.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
  } else {
    buffer = Buffer.from(
      file.replace(/^data:video\/\w+;base64,/, ""),
      "base64"
    );
  }
  const type = file.split(";")[0].split("/")[1];
  const data = {
    Bucket: bucket,
    Key: `contents/${fileName}.${type}`,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: `${typeFile}/${type}`,
  };
  const image = await s3.upload(data).promise();
  return image.Location;
};

const getObjectFromS3 = async (fileName) => {
  try {
    const { region, bucket, key } = AmazonS3URI(fileName);
    const data = {
      Bucket: bucket,
      Key: key,
    };
    const file = await s3Bucket.getObject(data).promise();
    const src = "data:video/mp4;base64," + file.Body.toString("base64");

    return src;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { uploadBase64, getObjectFromS3 };
