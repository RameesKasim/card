const Pool = require("pg").Pool;



const pool = new Pool({
  user: "postgres",   //db user
  password: "password", // db password
  host: "localhost",   // db host adress
  port: 5432,  // db port
  database: "carddb", // database name
});

module.exports = pool;
