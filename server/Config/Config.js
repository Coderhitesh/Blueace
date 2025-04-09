require('dotenv').config();

const config = {
    AWS: {
        AccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        AWSSecretKey: process.env.AWS_SECRET_KEY,
        BucketName: process.env.AWS_S3_BUCKET_NAME,
        Region: "eu-north-1",
    },
};

module.exports = config;
