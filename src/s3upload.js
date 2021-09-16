const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const S3Config = {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9001',
    /*credentials: {
        AccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        SecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },*/
    forcePathStyle: true,
    tls: false
}

const client = new S3Client(S3Config);

module.exports = async function(path, data) {
    const params = {
        Bucket: 'fantasy',
        Key: path + '.json',
        Body: Buffer.from(data)
    };

    try {
        const endpoint = await client.config.endpoint()

        const result = await client.send(new PutObjectCommand(params));
        console.log("Success", result);
        return result;
    } catch (err) {
        console.error("Error", err);

        const fs = require('fs');
        const localpath = `out/${path}`.split('/')
        const subpath = localpath.slice(0, localpath.length - 1).join('/')
        !fs.existsSync(subpath) && fs.mkdirSync(subpath, { recursive: true })
        fs.writeFileSync(`${subpath}/${localpath[localpath.length - 1]}.json`, Buffer.from(data))
    }
}