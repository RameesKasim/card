const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "chu2mndy",
  host: "localhost",
  port: 5432,
  database: "carddb",
});

module.exports = pool;
