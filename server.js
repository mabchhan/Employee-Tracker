const mysql = require("mysql2");
const inquirer = require("inquirer");
const console_table = require("console.table");

// for load environment variables
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: process.env.user,
  //  MySQL password
  password: process.env.password,
  database: "employees_db",
});

db.connect((err) => {
  if (err) throw err;
  else {
    console.log("Connected to the employees_db database.");
    start();
  }
});

// function to start app
function start() {
  inquirer
    .prompt({
      name: "questions",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update employee role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.questions) {
        case "View all departments":
          viewDepartment();
          break;

        case "View all roles":
          viewRole();
          break;

        case "View all employees":
          viewEmployee();
          break;

        case "Add a department":
          console.log("Add a department");
          break;

        case "Add a role":
          console.log("Add a role");
          break;

        case "Add an employee":
          console.log("Add a employee");
          break;

        case "Update employee role":
          console.log("Update employee role");
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

// view all department
const viewDepartment = () => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, data) => {
    if (err) {
      throw err;
    } else {
      console.log("View all departments \n");
      console.table(data);
      start();
    }
  });
};

// view all role
const viewRole = () => {
  const sql = `SELECT role.id, role.title, role.salary, department.name AS department FROM role 
                JOIN department 
                ON role.department_id = department.id`;
  db.query(sql, (err, data) => {
    if (err) {
      throw err;
    } else {
      console.log("View all roles \n");
      console.table(data);
      start();
    }
  });
};

// view all employee

const viewEmployee = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department 
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id`;
  db.query(sql, (err, data) => {
    if (err) throw err;
    else {
      console.log("View all employees \n");
      console.table(data);
      start();
    }
  });
};
