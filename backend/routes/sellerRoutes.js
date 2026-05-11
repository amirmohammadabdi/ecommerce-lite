const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const {Product} = require('../models/productModel')
const SellerCart = require('../models/sellerCartModel')

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            const dir = path.normalize(path.join(__dirname,'../uploads'))
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir)
            }
            cb(null, dir)
        },
        filename: (req, file, cb) => {
            const unique_suffix = Date.now() + '-' + Math.floor(Math.random()*1E9);

            cb(null, file.originalname.split('.')[0]+unique_suffix+path.extname(file.originalname))
        }
    }
)

const upload = multer({
    storage,
    limits: {fileSize: (10*1024*1024)},
    fileFilter: (req, file, cb) => {
        if(file.fieldname == "photo"){
            if(['.jpg', '.webp', '.png', 'jpeg'].includes(path.extname(file.originalname))){
                cb(null, true)
            }
            else{
                cb(new Error("only image format file is acceptable", false))
            }
        }
        else{
            cb(null, true)
        }
    }
}).array("photo", 10)

router.post('/upload', (req, res) => {
    upload(req, res, async function(err){
        if(err){
            return res.status(500).json({message: err.message})
        }
        
        const {name, price, category, features, number} = req.body
        const uploaded_files = req.files;

        try{
            const uploaded_data = []
            uploaded_files.forEach(f => {
                uploaded_data.push(f.filename)
            })

            const newProduct = new Product({
                name, price, category, features, number, imgs: uploaded_data, seller: req.user.id
            })
            await newProduct.save()
            res.status(201).json({message: "file was uploaded successfully"})
        }
        catch(err){
            res.status(500).json({message: err.message})
        }
    })
})

router.put("/product/:id", async(req, res) => {
    const {id} = req.params
    upload(req, res, async function(err){
        if(err) return res.status(500).json({message: err.message})
        
        const {name, price, category, features, number} = req.body
        const uploaded_files = req.files;

        try{
            const uploaded_data = []
            uploaded_files.forEach(f => {
                uploaded_data.push(f.filename)
            })

            await Product.updateOne({_id: id, seller: req.user.id}, {$set: {name, price, category, features, number}, $push: {imgs: uploaded_data}})
            res.status(200).json({message: "file was uploaded successfully", newImgs: uploaded_data})
        }
        catch(err){
            res.status(500).json({message: err.message})
        }
    })
})
router.put('/deleteImg/:id', async (req, res) => {
    const {id} = req.params;
    const {img} = req.body
    try{
        await Product.updateOne({_id: id}, {$pull: {imgs: img}})
        fs.unlinkSync(path.normalize(path.join(__dirname, '../uploads/'+img)))
        res.status(200).json({message: "remove the photo successfully."})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/products', async(req, res) => {
    try{
        const products = await Product.find({seller: req.user.id})
        res.status(200).json({message: "fetched the data successfully.", products})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})
router.delete('/product/:id', async(req, res) => {
    const {id} = req.params
    try{
        const product = await Product.findOne({_id:id, seller: req.user.id})
        product.imgs.forEach(img => {
            fs.unlinkSync(path.normalize(path.join(__dirname, '../uploads/'+img)))
        })
        await Product.deleteOne({_id: id, seller: req.user.id})
        res.status(200).json({message: "deleted the file successfully."})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})
router.get('/product/:id', async (req, res) => {
    const {id} = req.params
    try{
        const product = await Product.findById(id)
        res.status(200).json({message: "fetched the data successfully", product})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/cart', async(req, res) => {
    try{
        const carts = await SellerCart.find({seller: req.user.id}).populate('products.product')
        res.status(200).json({message: "fetched the carts successfully", carts})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router