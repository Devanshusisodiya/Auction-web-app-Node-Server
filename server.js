require('dotenv').config(); // PROTECT VITAL INFO

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const routes = require('./routes/routes');

app.use('/api', routes);
app.use(express.json());


const mongoose = require('mongoose');
// REQUEST CONNECTION TO DATABASE
mongoose.connect(
    process.env.DATABASE_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
// CHECK CONNECTION TO DATABASE
const db = mongoose.connection;
db.on('error', (error)=>{console.log(error)});
db.once('open', ()=>{console.log('Connected to Database')});


// API BASE POINT
app.get('/', async (req,res)=>{
    res.send('API BasePoint\n\n');
})


// INITIALIZE SERVER    
app.listen(PORT, function(){
    console.log('server started');
});