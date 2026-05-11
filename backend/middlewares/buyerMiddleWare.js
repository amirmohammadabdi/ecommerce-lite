const protctBuyer = (req, res, next) => {
    // console.log(req.user)
    if(req.user.role == "buy"){
        next()
    }
    else{
        res.status(400).json({message: "not authorized."})
    }
}

module.exports = protctBuyer