const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: String,
        price: String,
        number: Number,
        category: String,
        features: String,
        seller: mongoose.Schema.Types.ObjectId,
        imgs: [String]
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema);

module.exports = {Product, productSchema}