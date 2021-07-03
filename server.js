const PORT = 8000 || 3000;
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req,res)=>{
    res.send('API BasePoint')
})

app.listen(PORT, function(){
    console.log('server started');
});