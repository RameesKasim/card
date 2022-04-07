const mysql = require("mysql2");

const password = "Aq?~XWNBsnA[";
const user = "barracud_carduser";
const database = "barracud_card_database";

const pool = mysql.createPool({
  user: user, //db user
  password: password, // db password
  host: "localhost", // db host adress
  database: database, // database name
  debug: false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
