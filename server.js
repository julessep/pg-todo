let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
let cors = require('cors');
const PORT = 3000;


let pool = new pg.Pool({
  user: 'postgres',
  database: 'todos',
  password: '2288',
  host: 'localhost',
  port: 5432,
  max: 1000,
  idleTimeoutMillis: 30000,
})


let app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/tasks', function( request, response) {
  pool.connect(function (err, db, done) {
    if(err) {
      return response.status(400).send(err)
    } else {
      db.query('SELECT * FROM todos', function(err, table) {
        done();
        if(err) {
          return response.status(400).send(err)
        } else {
          return response.status(200).send(table.rows)
        }
      })
    }
  })

})
app.post('/api/tasks', function( request, response) {
  // console.log(request.body);
  var title = request.body.title;
  var id = request.body.id;
  let values = [title, id]
  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    } else {
  
      db.query('INSERT INTO todos (title, id) VALUES ($1, $2)', [...values], (err, table) => { done();
        if(err){
          return response.status(400).send(err);
        } else {
          console.log('DATA INSERTED');
          response.status(201).send({message: 'Task added!'});
        }
      })
    }
  });
}); 
app.delete('/api/remove/:id', function( request, response) {
  var id = request.params.id;
  pool.connect(function(err, db, done) {
    if(err){
      return response.status(400).send(err)
    } else {
      db.query('DELETE FROM todos WHERE id= $1', [id], function(err, result) {
        if(err){
          return response.status(400).send(err);
        } else {
          response.status(201).send({message: 'Task deleted!'});
        }
      })
  }
});
}); 

app.listen(PORT, () => console.log('Listening on port ' + PORT));