INSERT INTO department (name)
VALUES 
('IT'),
('Finance & Accounting'),
('Sales & Marketing'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 100000, 1),
('Software Engineer', 120000, 1),
('Accountant', 50000, 2), 
('Financial Analyst', 150000, 2),
('Marketing Coordindator', 70000, 3), 
('Sales Lead', 90000, 3),
('Project Manager', 130000, 4),
('Operations Manager', 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Mab', 'Chhan', 2, null),
('Bunhann', 'Thou', 1, 1),
('Sophea', 'Teng', 4, null),
('Sovann', 'Vireak', 3, 3),
('Bunleap', 'Hong', 6, null),
('Ana', 'Chau', 5, 5),
('Sopheak', 'Sak', 7, null),
('Makara', 'Long', 8, 7);