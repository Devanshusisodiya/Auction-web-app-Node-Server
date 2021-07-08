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

    let state = 0;

    if(username.length != 0 && password.length != 0){
        // BOTH USERNAME AND PASSWORD ARE PRESENT
        const users = await User.find();
        let currentUser;
        users.forEach((user)=>{
            // IF USERNAME IS CORRECT
            if(username === user.username){
                // STORE USER(FROM DATABASE) WHO IS TRYING TO LOG IN
                currentUser = user;
                // IF PASSWORD IS CORRECT
                if(password === currentUser.password){
                    state = 1;
                }
            }
        });
    }

    // IF BOTH USERNAME AND PASSWORD ENTERED WERE CORRECT STATE ---> 1 
    if(state === 1){
        res.status(203).json({message: `${username} logged in`});
    }else{
        res.status(410).json({message: 'invalid credentials'});
    }
});

// REGISTRATION
router.post('/reg/user', async (req, res)=>{

    const username = req.body.username;
    const users = await User.find();
    let state = 0;

    // CHECK TO SEE IF THE USER ALREADY EXISTS
    for(var ind in users){
        if(username === users[ind].username){
            res.status(414).json({message: 'this username already exists'});
            state = 1;
            break;
        }
    }

    // IF USER DOES NOT EXIST STATE ---> 0
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


// WRITE FILTER FOR DISTINCT ASSET NAMES GETTING REGISTERED
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