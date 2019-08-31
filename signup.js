const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs',
});

conn.connect(err => {
  if (err) throw err;
  console.log('Mysql Connected...');
});

var signup = function() {};

signup.prototype.addUser = function(req, res, callback) {
  let params = [req.body.phone, req.body.name, req.body.email, req.body.password],
    feedbackQuery = 'INSERT INTO users (phone,name,email,password) VALUES (?,?,?,?)';

  conn.query(feedbackQuery, params, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
};

module.exports = new signup();
