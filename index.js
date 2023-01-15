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
        "Delete employee",
        "Delete department",
        "Delete role",
        "Exit",
      ],

      //loop: false,
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
          //console.log("Add a employee");
          addEmployee();
          break;

        case "Update employee role":
          // console.log("Update employee role");
          updateEmployeeRole();
          break;

        case "Delete employee":
          deleteEmployee();
          break;

        case "Delete department":
          deleteDepartment();
          break;

        case "Delete role":
          deleteRole();
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
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, employee.manager_id
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

// function add employee

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fistName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      // {
      //   type: "list",
      //   name: "roleTitle",
      //   message: "What is the employee's role?",
      //   choices: roleList,
      // },
    ])
    .then((Response) => {
      console.log(Response);
      const params = [Response.fistName, Response.lastName];

      const sql = `SELECT * FROM role`;
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          const roleList = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "roleTitle",
                message: "What is the employee's role?",
                choices: roleList,
              },
            ])
            .then((selectedRole) => {
              console.log(params);
              params.push(selectedRole.roleTitle);
              console.log(params);

              const employeeSql = `SELECT * FROM employee`;
              db.query(employeeSql, (err, data) => {
                if (err) throw err;
                else {
                  const employeeList = data.map(
                    ({ id, first_name, last_name }) => ({
                      name: first_name + " " + last_name,
                      value: id,
                    })
                  );

                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "addManager",
                        message: "Who is manager's employee?",
                        choices: employeeList,
                      },
                    ])
                    .then((addManagerAnswer) => {
                      //console.log(addManagerAnswer.addManager);

                      params.push(addManagerAnswer.addManager);
                      console.log(params);

                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;

                      db.query(sql, params, (err) => {
                        if (err) throw err;
                        console.log("Employee has been added!");

                        viewEmployee();
                      });
                    });
                }
              });
            });
        }
      });
    });
};

// function update employee role
const updateEmployeeRole = () => {
  const sql = `SELECT * FROM employee`;
  db.query(sql, (err, data) => {
    if (err) throw err;
    else {
      const employeeList = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeList",
            message: "Which employee do you want to update role?",
            choices: employeeList,
          },
        ])
        .then((selectedEmployee) => {
          //console.log(selectedEmployee.addManager);
          const params = [selectedEmployee.employeeList];

          const sql = `SELECT * FROM role`;
          db.query(sql, (err, data) => {
            if (err) throw err;
            else {
              const roleList = data.map(({ id, title }) => ({
                name: title,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "roleTitle",
                    message: "What is the employee's new role?",
                    choices: roleList,
                  },
                ])
                .then((selectedRole) => {
                  params.push(selectedRole.roleTitle);
                  // console.log(params);

                  [params[0], params[1]] = [params[1], params[0]];

                  // console.log("after :");
                  // console.log(params);
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                  db.query(sql, params, (err) => {
                    if (err) throw err;
                    console.log("Employee has been updated!");

                    viewEmployee();
                  });
                });
            }
          });
        });
    }
  });
};

// function delete employee

const deleteEmployee = () => {
  const sql = `SELECT * FROM employee`;
  db.query(sql, (err, data) => {
    if (err) throw err;
    else {
      //console.log(data);
      const employeeList = data.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));

      // console.log(employeeList);
      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "Which employee do you want to delete?",
            choices: employeeList,
          },
        ])
        .then((selectedEmployee) => {
          const sql = `DELETE FROM employee WHERE id = ?`;
          db.query(sql, selectedEmployee.role, (err) => {
            if (err) throw err;
            console.log("\n Successfully deleted!");
            viewEmployee();
          });
        });
    }
  });
};

// function to delete department

const deleteDepartment = () => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, data) => {
    if (err) throw err;
    else {
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

// function to delete role

const deleteRole = () => {
  const sql = `SELECT * FROM role`;
  db.query(sql, (err, data) => {
    if (err) throw err;
    else {
      //console.log(data);
      const roleTitle = data.map(({ title, id }) => ({
        name: title,
        value: id,
      }));

      // console.log(roleTitle);
      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "What role do you want to delete?",
            choices: roleTitle,
          },
        ])
        .then((selectedRole) => {
          //console.log(selectedRole.role);
          // let selectID;
          // for (let i = 0; i < roleTitle.length; i++) {
          //   if (roleTitle[i].name === selectedRole.role) {
          //     selectID = roleTitle[i].id;
          //   }
          // }
          const sql = `DELETE FROM role WHERE id = ?`;
          db.query(sql, selectedRole.role, (err) => {
            if (err) throw err;
            console.log("\n Successfully deleted!");
            viewRole();
          });
        });
    }
  });
};
