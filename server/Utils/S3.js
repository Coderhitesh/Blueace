const { PutObjectCommand, S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const config = require('../Config/Config')

const s3Client = new S3Client({
    region: config.AWS.Region,
    credentials: {
        accessKeyId: config.AWS.AccessKeyId,
        secretAccessKey: config.AWS.AWSSecretKey
    }
})

const BUCEKT_NAME = config.AWS.BucketName


exports.pre_signed_url = async ({ key, contentType }) => {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCEKT_NAME,
            Key: key,
            ContentType: contentType
        })
        const fileLink = `https://${BUCEKT_NAME}.s3.${config.AWS.Region}.amazonaws.com/${key}`;
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 5 * 60,
        });
        return { fileLink, signedUrl };
    } catch (error) {
        throw new Error(`Error generating pre-signed URL: ${error.message}`);
    }
}

exports.getObjectUrl = async (key) => {
    try {

        const command = new GetObjectCommand({
            Bucket: BUCEKT_NAME,
            Key: key,
        })


        const url = await getSignedUrl(s3Client, command)
        if (!url) {
            throw new Error('Failed to generate signed URL')
        }

        return { url };
    } catch (error) {
        throw new Error(`Error generating pre-signed URL: ${error.message}`);
    }
}


exports.deleteObject = async (key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCEKT_NAME,
            Key: key,
        });

        const result = await s3Client.send(command);

        return { message: 'File deleted successfully', result };
    } catch (error) {
        throw new Error(`Error deleting object from S3: ${error.message}`);
    }
};
