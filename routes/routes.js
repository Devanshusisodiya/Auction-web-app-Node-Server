const router = require('express').Router();
const User = require('../models/user');
const Asset = require('../models/asset');


// USER RELATED REQUESTS

router.get('/get-users', async (req,res)=>{
    const userData =  await User.find();
    res.json(userData);
    console.log(userData);
});

//LOGIN
router.post('/login', async (req, res)=>{


    var username = req.body.username;
    var password = req.body.password;

    
    if(username.length != 0 && password.length != 0){
        // BOTH USERNAME AND PASSWORD ARE PRESENT
        const users = await User.find();
        let currentUser;
        users.forEach((user)=>{
            // IF USERNAME IS CORRECT
            if(username === user.username){
                // VAR TO STORE A USER(FROM DATABASE) WHO IS TRYING TO LOG IN
                currentUser = user;
                // IF USERNAME IS CORRECT
                if(password === currentUser.password){
                    res.status(203).json({message: `${username} logged in`});
                }else{
                    res.status(412).json({message: 'wrong password'});
                }
            }else{
                res.status(413).json({message: 'username doesnt exist'});
                state = 0;
            }
        });

    }else{
        if(username.length === 0 && password.length === 0){
            // BOTH USERNAME AND PASSWORD ARE ABSENT
            res.status(410).json({message: 'invalid credentials'});
        }
        else{
            if(username.length === 0){
                // USERNAME IS ABSENT
                res.status(409).json({message: 'invalid username'});
            }else{
                // PASSWORD IS ABSENT
                res.status(408).json({message: 'invalid password'});
            }
        }
    }
});

// REGISTRATION
router.post('/reg/user', async (req, res)=>{
    const username = req.body.username;

    const users = await User.find();
    let state = 0;


    for(var ind in users){
        if(username === users[ind].username){
            res.status(414).json({message: 'this username already exists'});
            state = 1;
            break;
        }
    }

    if(state === 0){
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });    
        try{
            const newUser = await user.save(); 
            res.status(201).json({message: 'new user created', user: newUser});
        }catch(error){
            res.status(400).json({message: error.message});
        }
    }
    
});


// ASSET RELATED REQUESTS

router.get('/get-assets', async (req, res)=>{
    const assetData = await Asset.find();
    res.json(assetData);
    console.log(assetData);


});

router.post('/reg/asset', async (req,res)=>{
    const asset = new Asset({
        name: req.body.name,
        price: req.body.price,
        minimumBid: req.body.minimumBid,
        openingDate: req.body.openingDate,
        closingDate: req.body.closingDate
    });

    try{
        const newAsset = await asset.save();
        res.status(201).json({message: 'new asset added', asset: newAsset});
    }catch(error){
        res.status(400).json({message: 'bad request'});
    }
});

module.exports = router;


// CREATE MORE ROUTES