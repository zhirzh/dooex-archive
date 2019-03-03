const { Schema } = require('mongoose');

const DoodleSchema = new Schema({
  id: {
    required: true,
    type: 'String',
  },

  aspect: {
    type: 'Number',
    required: true,
  },

  countries: [
    {
      type: 'String',
    },
  ],

  date: {
    type: 'Date',
    required: true,
  },

  high_res_url: {
    type: 'String',
  },

  name: {
    type: 'String',
    required: true,
  },

  standalone_html: {
    type: 'String',
  },

  tags: [
    {
      type: 'String',
    },
  ],

  title: {
    type: 'String',
    required: true,
  },

  type: {
    type: 'String',
    required: true,
  },

  url: {
    type: 'String',
    required: true,
  },
});

function Doodle(conn) {
  return conn.model('Doodle', DoodleSchema);
}

module.exports = Doodle;
