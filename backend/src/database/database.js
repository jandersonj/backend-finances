const knex = require('knex')({
    client: 'pg',
    version: '13.2',
    connection: {
//       host : 'localhost',
//       user : 'prisma',
//       password : 'prisma',
      database : process.env.DATABASE_URL || 'postgres'
    }
  });


module.exports = knex
