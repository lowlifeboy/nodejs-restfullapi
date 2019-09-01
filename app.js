const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { check, validationResult } = require('express-validator');

const app = express();

// parse application/json
app.use(bodyParser.json());

// -------------------- Common section --------------------

/** verifyToken method - this method verifies token */
function verifyToken(req, res, next) {
  //Request header with authorization key
  const bearerHeader = req.headers['authorization'];

  //Check if there is  a header
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');

    //Get Token arrray by spliting
    const bearerToken = bearer[1];
    req.token = bearerToken;
    //call next middleware
    next();
  } else {
    res.sendStatus(403);
  }
}

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

let currentUserData = {
  id: 0,
  phone: '',
  email: '',
};

app.get('/', (req, res) => {
  res.send('Home page');
});

// -------------------- SignIn / SignUp --------------------

app.post(
  '/api/register',
  [
    check('phone').isNumeric(),
    check('name').isLength({ min: 3 }),
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let data = {
      phone: req.body.phone,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    let sql = `INSERT INTO users SET ?`;
    let query = conn.query(sql, data, (err, results) => {
      if (err) throw err;

      jwt.sign(
        { email: data[0], password: data[1] },
        'SuperSecRetKey',
        { expiresIn: 60 * 60 },
        (err, token) => {
          res.json({ token });
        }
      );
    });
  }
);

app.post('/api/login', (req, res) => {
  let data = [req.body.email, req.body.password];
  let sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  let query = conn.query(sql, data, (err, results) => {
    if (err || results.length === 0) {
      res.statusCode = 422;
      res.send(
        JSON.stringify({
          field: 'password',
          message: 'Wrong email or password',
        })
      );
    }

    jwt.sign(
      { email: data[0], password: data[1] },
      'SuperSecRetKey',
      { expiresIn: 60 * 60 },
      (err, token) => {
        currentUserData.id = results[0].id;
        currentUserData.phone = results[0].phone;
        currentUserData.email = results[0].email;
        res.json({ token });
      }
    );
  });
});

app.get('/api/me', verifyToken, (req, res) => {
  jwt.verify(req.token, 'SuperSecRetKey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else if (currentUserData.id === 0) {
      res.sendStatus(401);
      res.send();
    } else {
      res.send(JSON.stringify({ response: currentUserData }));
    }
  });
});

// -------------------- Users section --------------------

app.get('/users', (req, res) => {
  let sql = 'SELECT * FROM users';
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

app.get('/users/:id', (req, res) => {
  let id = req.params.id;
  let sql = `SELECT * FROM users WHERE id = ?`;
  let query = conn.query(sql, id, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

app.put('/users/:id', (req, res) => {
  let data = [req.body.phone, req.body.name, req.body.email, req.body.password, req.params.id];
  let sql = `UPDATE users SET phone = ?, name = ?, email = ?, password = ? WHERE id = ?`;
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

app.delete('/users/:id', (req, res) => {
  let id = req.params.id;
  let sql = `DELETE FROM users WHERE id = ?`;
  let query = conn.query(sql, id, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

// -------------------- Items section --------------------

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
  let id = req.params.id;
  let sql = `SELECT * FROM items WHERE id = ?`;
  let query = conn.query(sql, id, (err, results) => {
    if (err) {
      throw err;
    } else if (results.length === 0) {
      res.statusCode = 422;
      res.send();
    } else {
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    }
  });
});

//add new items
app.post(
  '/items',
  [check('title').isLength({ min: 3 }), check('price').isNumeric(), check('user_id').isNumeric()],
  verifyToken,
  (req, res) => {
    jwt.verify(req.token, 'SuperSecRetKey', (err, authData) => {
      if (err) {
        res.sendStatus(403);
      }
      if (currentUserData.id === 0) {
        res.sendStatus(401);
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      let data = {
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
        user_id: req.body.user_id,
      };
      let sql = `INSERT INTO items SET ?`;
      let query = conn.query(sql, data, (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          res.sendStatus(404);
        }
        res.send(JSON.stringify({ status: 200, error: null, response: results }));
      });
    });
  }
);

//update items
app.put('/items/:id', verifyToken, (req, res) => {
  let data = [req.body.title, req.body.price, req.body.image, req.body.user_id, req.params.id];
  let sql = `UPDATE items SET title = ?, price = ?, image = ?, user_id = ? WHERE id = ?`;
  jwt.verify(req.token, 'SuperSecRetKey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    if (currentUserData.id === 0) {
      res.sendStatus(401);
    }
    let query = conn.query(sql, data, (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.sendStatus(404);
      }
      if (results[0].title.length < 3) {
        res.sendStatus(422);
        res.send([
          {
            field: 'title',
            message: 'Title should contain at least 3 characters',
          },
        ]);
      }
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  });
});

//Delete items
app.delete('/items/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, 'SuperSecRetKey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    if (currentUserData.id === 0) {
      res.sendStatus(401);
    }

    let id = req.params.id;
    let sql = `DELETE FROM items WHERE id = ?`;
    let query = conn.query(sql, id, (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        res.sendStatus(404);
      }
      res.sendStatus(200);
    });
  });
});

//Server listening
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
