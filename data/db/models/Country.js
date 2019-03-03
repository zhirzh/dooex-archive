const { Schema } = require('mongoose');

const CountrySchema = new Schema({
  value: {
    index: true,
    required: true,
    type: 'String',
    unique: true,
  },
});

function Country(conn) {
  return conn.model('Country', CountrySchema);
}

module.exports = Country;
