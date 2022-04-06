const mysql = require("mysql2");

const pool = mysql.createPool({
  user: "card_user", //db user
  password: "chu2mndy", // db password
  host: "localhost", // db host adress
  database: "carddb", // database name
  debug: false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
