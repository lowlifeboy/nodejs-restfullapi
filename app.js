const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
// const Joi = require('joi');

// parse application/json
app.use(bodyParser.json());

//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs',
});

//connect to database
conn.connect(err => {
  if (err) throw err;
  console.log('Mysql Connected...');
});
app.get('/', (req, res) => {
  res.send('Home page');
});

app.get('/users', (req, res) => {
  let sql = 'SELECT * FROM users';
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

app.get('/users/:id', (req, res) => {
  let data = [
    req.params.id,
  ];
  let sql = `SELECT * FROM users WHERE id = ?`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

app.post('/users', (req, res) => {
  let data = {
    phone: req.body.phone,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  let sql = `INSERT INTO users SET ?`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

app.put('/users/:id', (req, res) => {
  let data = [
    req.body.phone,
    req.body.name,
    req.body.email,
    req.body.password,
    req.params.id,
  ];
  let sql =
    `UPDATE users SET phone = ?, name = ?, email = ?, password = ? WHERE id = ?`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

app.delete('/users/:id', (req, res) => {
  let data = [
    req.params.id,
  ];
  let sql = `DELETE FROM users WHERE id = ?`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//show all items
app.get('/items', (req, res) => {
  let sql = `SELECT * FROM items`;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//show single item
app.get('/items/:id', (req, res) => {
  let data = [
    req.params.id,
  ];
  let sql = `SELECT * FROM items WHERE id = ?`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//add new items
app.post('/items', (req, res) => {
  let data = {
    title: req.body.title,
    price: req.body.price,
    image: req.body.image,
    user_id: req.body.user_id,
  };
  let sql = `INSERT INTO items SET ?`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//update items
app.put('/items/:id', (req, res) => {
  let data = [
    req.body.title,
    req.body.price,
    req.body.image,
    req.body.user_id,
    req.params.id,
  ];
  let sql =
    `UPDATE items SET title = ?, price = ?, image = ?, user_id = ? WHERE id = ?`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//Delete items
app.delete('/items/:id', (req, res) => {
  let data = [
    req.params.id,
  ];
  let sql = `DELETE FROM items WHERE id = ?`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//Server listening
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
