const knex = require('knex')({
    client: 'pg',
    version: '13.3',
    connection: process.env.DATABASE_URL,
    pool: {
        min: 2,
        max: 10
    }
  });


module.exports = knex
