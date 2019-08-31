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
  let data = {
    phone: req.body.phone,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  let sql = `INSERT INTO users SET ?`;

  conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
};

module.exports = new signup();
