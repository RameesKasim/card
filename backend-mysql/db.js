const mysql = require("mysql2");

const server = {
  password: "b71~phWLitYa",
  user: "barracud_card_user",
  host: "localhost",
  database: "barracud_card_db",
};

const local = {
  user: "card_user", //db user
  password: "chu2mndy", // db password
  host: "localhost", // db host adress
  database: "carddb", // database name
};

const pool = mysql.createPool({
  user: server.user, //db user
  password: server.password, // db password
  host: server.host, // db host adress
  database: server.database, // database name
  debug: false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
