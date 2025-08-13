// app/config/spaces.js
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT, // ej: https://nyc3.digitaloceanspaces.com
  region: process.env.SPACES_REGION,     // ej: nyc3
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

module.exports = s3;