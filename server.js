const mysql = require("mysql2");
const inquirer = require("inquirer");
const console_table = require("console.table");

// for load environment variables
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: process.env.user,
    //  MySQL password
    password: process.env.password,
    database: "employees_db",
  },
  console.log("Connected to the employees_db database.")
);

// db.connect((err) => {
//   if (err) throw err;
//   else {
//     console.log("Connected to the employees_db database.");
//   }
// });
