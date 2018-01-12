let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/task', function( request, response) {
  // console.log(request.body);
  var title = request.body.title;
  var id = Math.floor(Math.random() * 150);
  let values = [title, id]
  pool.connect((err, db, done) => {
    if(err) {
      return console.log(err)
    } else {
  
      db.query('INSERT INTO todos (title, id) VALUES ($1, $2)', [...values], (err, table) => { done();
        if(err){
          return console.log(err)
        } else {
          console.log('DATA INSERTED');
          db.end();
        }
      })
    }
  });
}); 

app.listen(PORT, () => console.log('Listening on port ' + PORT));