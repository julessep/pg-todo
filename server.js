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
  max: 100,
  idleTimeoutMillis: 30000,
})

// pool.connect((err, db, done) => {
//   if(err) {
//     return console.log(err);
//   } else {

//     db.query('SELECT * FROM todos', (err, table) => { done();
//       if(err){
//         return console.log(err)
//       } else {
//         console.log(table.rows);
//         db.end();
//         response.status(201).send({message: 'Data inserted!'});
//       }
//     })
//   }
// });

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.listen(PORT, () => console.log('Listening on port ' + PORT));