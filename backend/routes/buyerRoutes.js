const router = require('express').Router()
const Cart = require('../models/cartModel')
const SellerCart = require('../models/sellerCartModel')
const {Product} = require('../models/productModel')

router.post("/cart", async(req, res) => {
    const {cart, total, address} = req.body
    // console.log(req.body)
    try{
        let product_data = []
        let seller_product_data = {}
        cart.forEach(async(p) => {
            product_data.push({
                product: p._id,
                quantity: p.quantity
            })
            await Product.updateOne({_id: p._id}, {$set: {number: p.number-p.quantity}})
            let isthere = false;
            Object.keys(seller_product_data).forEach(key => {
                if(p.seller == key){
                    seller_product_data[key].push({
                        product: p._id,
                        quantity: p.quantity
                    })
                    isthere = true
                }
            })
            if(!isthere){
                seller_product_data[p.seller] = [{
                    product: p._id,
                    quantity: p.quantity
                }]
            }
        })
        const newCart = new Cart({
            total,
            address,
            buyer: req.user.id,
            status: 'in process',
            products: product_data
        })
        let inserted = await newCart.save()

        Object.keys(seller_product_data).forEach(async (key) => {
            let newSellerCart = new SellerCart({
                seller: key,
                address,
                cartId: inserted._id,
                products: seller_product_data[key]
            })
            await newSellerCart.save()
        })
        

        res.status(201).json({message: 'was added successfully.'})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/cart', async(req, res) => {
    try{
        const carts = await Cart.find({buyer: req.user.id}).populate('products.product')
        res.status(200).json({
            message: "fetched the cart successfully",
            carts
        })
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router