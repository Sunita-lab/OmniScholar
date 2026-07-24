const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gfsBucket;

const initGridFS = () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });
};

const getGFSBucket = () => gfsBucket;

module.exports = { initGridFS, getGFSBucket };