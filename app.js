const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');

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

//show all items
app.get('/items', (req, res) => {
  let sql = 'SELECT * FROM items';
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//show single item
app.get('/items/:id', (req, res) => {
  let sql = 'SELECT * FROM items WHERE id=' + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//add new items
app.post('/items', (req, res) => {
  let data = {
    title: req.body.title,
    price: req.body.price,
  };
  let sql = 'INSERT INTO items SET ?';
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//update items
app.put('/items/:id', (req, res) => {
  let sql =
    "UPDATE items SET title='" +
    req.body.title +
    "', price='" +
    req.body.price +
    "', user_id='" +
    req.params.user_id +
    "', image='" +
    req.params.image +
    "' WHERE id=" +
    req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//Delete items
app.delete('/items/:id', (req, res) => {
  let sql = 'DELETE FROM items WHERE id=' + req.params.id + '';
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

//Server listening
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
