const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.EXPIRES_IN;

const Seller = require('../models/sellerModel')
const Buyer = require('../models/buyerModel')

router.post('/sell/register', async (req, res) => {
    const { username, password, name } = req.body;
    try{
        const userExists = await Seller.findOne({username})
        if(userExists) return res.status(400).json({message: "username already exists."})
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new Seller({username, password: hash, products:[], name})
        await newUser.save()
        res.status(201).json({message: "registering was done successfully"})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

router.post('/buy/register', async (req, res) => {
    const {username, password} = req.body
    try{
        const userEixsts = await Buyer.findOne({username})
        if(userEixsts) return res.status(400).json({message: "username already exists"})
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new Buyer({username, password:hash, carts:[]})
        await newUser.save()
        res.status(201).json({message: "registering was done successfully"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.post('/login/:role', async(req, res) => {
    const {role} = req.params;
    const {username, password} = req.body;
    console.log(role)
    try{
        if(role == "sell"){
            const user = await Seller.findOne({username})
            if(!user) return res.status(401).json({message: "credentials are wrong"})

            const isMatch = await user.comparePassword(password)
            if(!isMatch){
                return res.status(401).json({message: "credentials are wrong"}) 
            }
            
            const payload = {
                id: user._id,
                name: user.name,
                role: 'sell'
            }

            jwt.sign(payload, JWT_SECRET, {expiresIn: EXPIRES_IN}, (err, token) => {
                if(err) throw err
                return res.status(200).json({message: "you logged in successfully", token: `Bearer ${token}`, payload})
            })
        }
        else{
            const user = await Buyer.findOne({username})
            if(!user) return res.status(401).json({message: "credentials are wrong"})

            const isMatch = await user.comparePassword(password)
            if(!isMatch){
                return res.status(401).json({message: "credentials are wrong"}) 
            }
            
            const payload = {
                id: user._id,
                name: user.name,
                role: 'buy'
            }

            jwt.sign(payload, JWT_SECRET, {expiresIn: EXPIRES_IN}, (err, token) => {
                if(err) throw err
                return res.status(200).json({message: "you logged in successfully", token: `Bearer ${token}`, payload})
            })
        }
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router