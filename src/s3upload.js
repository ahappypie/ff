const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const S3Config = {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9001'
}

const client = new S3Client(S3Config);

module.exports = async function(path, data) {
    const params = {
        Bucket: 'fantasy',
        Key: 'fantasy/' + path + '.json',
        Body: Buffer.from(data)
    };

    try {
        const result = await client.send(new PutObjectCommand(params));
        console.log("Success", result);
        return result;
    } catch (err) {
        console.error("Error", err);
    }
}