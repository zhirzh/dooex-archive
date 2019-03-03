const { Schema } = require('mongoose');

const TagSchema = new Schema({
  value: {
    index: true,
    required: true,
    type: 'String',
    unique: true,
  },
});

function Tag(conn) {
  return conn.model('Tag', TagSchema);
}

module.exports = Tag;
