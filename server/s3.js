require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const sharp = require('sharp');

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
	region,
	accessKeyId,
	secretAccessKey,
});

// upload file to s3
function uploadS3File(file) {
	const fileStream = fs.createReadStream(file.path);

	const uploadParams = {
		Bucket: bucketName,
		Body: fileStream,
		Key: file.filename,
	};

	return s3.upload(uploadParams).promise();
}
exports.uploadS3File = uploadS3File;

// Get a file from s3

function getFileStream(fileKey) {
	const downLoadParams = {
		Key: fileKey,
		Bucket: bucketName,
	};

	return s3.getObject(downLoadParams).createReadStream();
}
exports.getFileStream = getFileStream;
