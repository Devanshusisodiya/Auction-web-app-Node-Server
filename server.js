require('dotenv'); // PROTECT VITAL INFO

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();

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
db.once('connnect', ()=>{console.log('Connected to Database')});


app.get('/', (req,res)=>{
    res.send('API BasePoint')
})


// INITIALIZE SERVER    
app.listen(PORT, function(){
    console.log('server started');
});