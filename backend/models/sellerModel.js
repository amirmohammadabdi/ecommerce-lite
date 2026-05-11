const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const sellerSchema = new mongoose.Schema(
    {
        name: String,
        username: String,
        password: String,
        products: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}]
    },
    {
        timestamps: true
    }
)

sellerSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}

const Seller = mongoose.model("Seller", sellerSchema)
module.exports = Seller