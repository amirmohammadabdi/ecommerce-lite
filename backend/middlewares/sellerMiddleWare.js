const protectSeller = (req, res, next) => {
    if(req.user.role == "sell"){
        next()
    }
    else{
        res.status(400).json({message: "not authorized."})
    }
}

module.exports = protectSeller