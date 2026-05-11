const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
    {
        seller: mongoose.Schema.Types.ObjectId,
        cartId: mongoose.Schema.Types.ObjectId,
        products: [{
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: Number
        }],
        address: {
            address: String,
            postalCode: String,
            phoneNumber: String,
            name: String,
        }
    },
    {
        timestamps: true
    }
)

const Cart = mongoose.model('SellerCart', cartSchema)

module.exports = Cart