const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
    {
        total: Number,
        status: String,
        buyer: mongoose.Schema.Types.ObjectId,
        address: {
            address: String,
            postalCode: String,
            phoneNumber: String,
            name: String,
        },
        products: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: {type: Number}
        }]
    }
)

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart