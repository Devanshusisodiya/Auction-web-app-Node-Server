const router = require('express').Router();
const User = require('../models/user');
const Asset = require('../models/asset');
const Bid = require('../models/bid');

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

    let state = false;

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
                    state = true;
                }
            }
        });
    }

    // IF BOTH USERNAME AND PASSWORD ENTERED WERE CORRECT STATE ---> true
    if(state){
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

    const assetName = req.body.name;
    const assets = await Asset.find();
    let state = 0;

    for(var index in assets){
        console.log(assets[index].price);
        if(assetName === assets[index].name){
            res.status(420).json({message: 'asset already exists'});
            state = 1;
            break;
        }
    }
    if(state === 0){
        const asset = new Asset({
            name: req.body.name,
            winner: req.body.winner,
            price: req.body.price,
            minimumBid: req.body.minimumBid, 
            openingDate: req.body.openingDate,
            closingDate: req.body.closingDate
        });

        const bid = new Bid({
            assetName: req.body.name,
            // bidders: [],
        })
    
        try{
            const newBid = await bid.save();
            const newAsset = await asset.save();
            res.status(201).json({message: 'new asset added and bid initialized', asset: newAsset, bid: newBid});
        }catch(error){
            res.status(400).json({message: 'bad request'});
        }
    }
});

router.patch('/patch-status', async(req, res)=>{
    const query = {name: req.body.assetName};
    const updateDoc = {status: req.body.status};

    try{
        const result = await Asset.findOneAndUpdate(query, updateDoc, {
            useFindAndModify: false,
            new: true
        });
        res.status(222).json({message: 'status changed', doc: result});
    }catch (error){
        res.status(422).json({message: error.message});
    }
});

// BIDDING ROUTES 

router.get('/get-bids', async (req, res)=>{
    const bids = await Bid.find();
    res.json(bids);
    console.log(bids);
});

router.patch('/patch', async (req, res)=>{
    const query = {assetName: req.body.assetName};
    const bids = await Bid.findOne(query);

    let state = 1;
    const bidderName = req.body.name;

    for(var index in bids.bidders){
        if(bidderName === bids.bidders[index].name){
            state = 0;
        }
    }
    if(state === 0){
        const query = {assetName: req.body.assetName, "bidders.name": req.body.name};
        const updateDoc = {
            $set: {
                "bidders.$.price": req.body.price
            }
        };
        try{
            const result = await Bid.findOneAndUpdate(query, updateDoc, {useFindAndModify: false, new: true});
            res.status(221).json({message: 'bidder added', doc: result});
        }catch (error){
            res.status(421).json({message: error.message});
        }

    }else{
        const updateDoc = {
            $push: {
                "bidders": {'name': req.body.name, 'price': req.body.price}
            }
        };
        try{
            const result = await Bid.findOneAndUpdate(query, updateDoc, {
                useFindAndModify: false,
                new: true
            });
            res.status(221).json({message: 'bidder added', doc: result});
        }catch (error){
            res.status(421).json({message: error.message});
        }
    }
});


// FUNCTIONALITIES

router.get('/search/:search_param', async (req, res)=>{
    const assets = await Asset.find();
    var namedAssets = [];
    for(var index in assets){
        if(assets[index]['name'].includes(req.params.search_param)){
            namedAssets.push(assets[index]);
        }
    }
    if(namedAssets.length === 0){
        res.status(224).json({search_results: 'no results found'});
    }else{
        res.status(223).json(namedAssets);
    }
});


module.exports = router;