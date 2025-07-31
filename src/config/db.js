const mysql = require("mysql2/promise");
const chalk = require("chalk");
const { yellow, green } = chalk;

console.log(yellow("[DEBUG] Initializing MySQL connection pool at"), new Date().toISOString());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log(green("[SUCESS] MySQL connection pool created with config:"),
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    timestamp: new Date().toISOString(),
  }
);

module.exports = pool;
