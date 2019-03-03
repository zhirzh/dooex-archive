const mongoose = require('mongoose');

const config = require('./config');

const Country = require('./models/Country');
const Doodle = require('./models/Doodle');
const Tag = require('./models/Tag');

mongoose.Promise = global.Promise;

const db = {};

const conn = mongoose.createConnection(
  config.mongoURL,
  {
    promiseLibrary: global.Promise,
    useMongoClient: true,
  },
  (err) => {
    throw err;
  },
);

db.conn = conn;

db.Country = Country(conn);
db.Doodle = Doodle(conn);
db.Tag = Tag(conn);

db.drop = () => conn.dropDatabase();

module.exports = db;
