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
        "Delete department",
        "Exit",
      ],

      loop: false,
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
          //console.log("Add a department");
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          console.log("Add a employee");
          break;

        case "Update employee role":
          console.log("Update employee role");
          break;

        case "Delete department":
          deleteDepartment();
          break;

        case "Exit":
          db.end();
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

// add department

const addDepartment = () => {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What department do you want to add? ",
      validate: (department) => {
        if (department) return true;
        else {
          console.log("Please input new department");
          return false;
        }
      },
    })
    .then((answer) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      db.query(sql, answer.department, (err, data) => {
        if (err) throw err;
        else {
          console.log(`new department has been added.`);
          viewDepartment();
        }
      });
    });
};

// add role

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "What role do you want to add? ",
        validate: (role) => {
          if (role) return true;
          else {
            console.log("Please input new role");
            return false;
          }
        },
      },
      {
        name: "salary",
        type: "input",
        message: "What is salary? ",
        validate: (salary) => {
          if (salary) return true;
          else {
            console.log("Please input salary");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      // console.log(answer);
      const param = [answer.role, answer.salary];
      // console.log(param);
      const sql = `SELECT * FROM department`;
      db.query(sql, (err, data) => {
        //console.log(data);
        if (err) {
          throw err;
        } else {
          // console.log(data);
          inquirer
            .prompt({
              name: "department",
              type: "list",
              message: "What department do you want to add for this role? ",
              choices: data,
            })
            .then((listAnswer) => {
              let idChoice;
              for (let i = 0; i < data.length; i++) {
                if (data[i].name === listAnswer.department) {
                  idChoice = data[i].id;
                }
              }
              param.push(idChoice);
              const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
              //console.log(param);
              db.query(sql, param, (err, data) => {
                if (err) throw err;
                else {
                  console.log(`new role has been added.`);
                  viewRole();
                }
              });
            });
        }
      });
    });
};

// function to delete department
const deleteDepartment = () => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, data) => {
    if (err) throw err;
    else {
      //const dept = data.map(({ name, id }) => ({ name: name, value: id }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "department",
            message: "What department do you want to delete?",
            choices: data,
          },
        ])
        .then((selectedDepartment) => {
          let selectID;
          for (let i = 0; i < data.length; i++) {
            if (data[i].name === selectedDepartment.department) {
              selectID = data[i].id;
            }
          }
          const sql = `DELETE FROM department WHERE id = ?`;

          db.query(sql, selectID, (err, result) => {
            if (err) throw err;
            console.log("\n Successfully deleted!");
            viewDepartment();
          });
        });
    }
  });
};
