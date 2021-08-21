const knex = require('knex')({
    client: 'pg',
    version: '13.2',
    connection: {
      host : 'ec2-52-0-67-144.compute-1.amazonaws.com',
      user : 'xqvbkofxrutdbx',
      password : 'b5b7d0e2ea80bdccd1dc3393ed3357823572acb2f8d220d9b697246d76aa1d9a',
      database : process.env.DATABASE_URL || 'postgres'
    }
  });


module.exports = knex
