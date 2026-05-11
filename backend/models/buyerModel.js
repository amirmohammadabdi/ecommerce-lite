const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const buyerSchema = new mongoose.Schema(
    {
        username: String,
        password: String
    },
    {
        timestamps: true
    }
)

buyerSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}

const Buyer = mongoose.model("Buyer", buyerSchema);

module.exports = Buyer