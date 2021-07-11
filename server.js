require('dotenv').config(); // PROTECT VITAL INFO

const express = require('express');
const cors = require('cors');
const app = express();

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//     next()
//   });
var options = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
  app.use(cors(options));


const mongoose = require('mongoose');
// REQUEST CONNECTION TO DATABASE
const uri = process.env.DATABASE_URI;
mongoose.connect(
    uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
// CHECK CONNECTION TO DATABASE
const db = mongoose.connection;
db.on('error', (error)=>{console.log(error)});
db.once('open', ()=>{console.log('Connected to Database')});

const PORT = process.env.PORT;
const routes = require('./routes/routes');

app.use(express.json());
app.use('/api', routes);

// API BASE POINT
app.get('/', (req,res)=>{
    res.send('API BasePoint\n\n');
})


// INITIALIZE SERVER    
app.listen(PORT, function(){
    console.log('server started');
});