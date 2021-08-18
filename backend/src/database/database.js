const knex = require('knex')({
    client: 'pg',
    version: '13.2',
    connection: {
      host : 'localhost',
      user : 'prisma',
      password : 'prisma',
      database : 'postgres'
    }
  });


module.exports = knex