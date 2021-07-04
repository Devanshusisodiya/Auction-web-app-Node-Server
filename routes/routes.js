const router = require('express').Router();
const Hero = require('../models/hero')

router.get('/', async (req,res)=>{
    const data =  await Hero.find();
    res.json(data);
    // res.send(`routed get ${req.params['id']}`);
});


module.exports = router;