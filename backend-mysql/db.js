const mysql = require("mysql2");

const server = {
  password: "b71~phWLitYa",
  user: "barracud_user",
  host: "localhost",
  database: "barracud_database",
};

const local = {
  user: "card_user", //db user
  password: "chu2mndy", // db password
  host: "localhost", // db host adress
  database: "carddb", // database name
};

const pool = mysql.createPool({
  user: local.user, //db user
  password: local.password, // db password
  host: local.host, // db host adress
  database: local.database, // database name
  debug: false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
