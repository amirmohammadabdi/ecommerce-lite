require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require("mongoose")

const authRoutes = require('./routes/authRoutes')
const sellerRoutes = require('./routes/sellerRoutes')
const buyerRoutes = require('./routes/buyerRoutes')
const protectBuyer = require('./middlewares/buyerMiddleWare')
const protect = require('./middlewares/auth')
const protectSeller = require('./middlewares/sellerMiddleWare')
const {Product} = require('./models/productModel')

const PORT = process.env.PORT || 8000
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI).then(() => {
    console.log("connected to mongodb.")
}).catch(err => {
    console.log(err.message)
})

app.use(cors({
    origin: 3000,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))
app.use("/uploads", express.static(__dirname+"/uploads"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/auth', authRoutes)
app.use('/seller', protect, protectSeller, sellerRoutes)

app.use('/buyer', protect, protectBuyer, buyerRoutes)

app.get('/userState', protect, (req, res) => {
    res.status(200).json(req.user)
})
app.get('/products/:page', async(req, res) => {
    const page = req.params.page || 1
    const number = 2
    let offset = number*(page-1)
    try{
        let products = await Product.find().select("_id name price imgs").skip(offset).limit(number).exec()
        let productCount = await Product.countDocuments()
        res.status(200).json({message: 'fetched the data successfully.', products, count: Math.ceil(productCount/number)})
    }
    catch(err){
        res.status(500).json()
    }
})
app.get('/product/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message: 'no product found'})
        }
        res.status(200).json({message: 'fetch the data successfully', product})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})
app.post('/search', async(req, res) => {
    try{
        const {search} = req.body
        const products = await Product.find({
            $or: [
                { name: {$regex: search, $options: 'i'} },
                { features: {$regex: search, $options: 'i'} }
            ]
        })

        res.status(200).json({message: "fetched the products.", products})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}:`)
})