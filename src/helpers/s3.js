
const { s3Bucket } = require('../config/s3')

const uploadBase64 = async (bucket, fileName, file) => {
    const buffer = Buffer.from(file.replace(/^data:video\/\w+;base64,/, ""), 'base64')
    const type = file.split(';')[0].split('/')[1];
    const data = {
        Bucket: bucket,
        Key: `${fileName}.${type}`,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: `video/${type}`
    };
    const image = await s3Bucket.putObject(data, function (err, data) {
        if (err) {
            console.log(err);
            console.log('Error uploading data: ', data);
        } else {
            console.log('successfully uploaded the image!');
        }
    });
    return image
}

const getObjectFromS3 = async (bucket, fileName) => {
    const data = {
        Bucket: bucket,
        Key: `${fileName}.mp4`,
    };
    const file = await s3Bucket.getObject(data).promise();
    const src = "data:video/mp4;base64," + file.Body.toString('base64');

    return src;
}

module.exports = { uploadBase64, getObjectFromS3 }

