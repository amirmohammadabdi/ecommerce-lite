const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET;

const protect = (req, res, next) => {
    let token = null
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            const token = req.headers.authorization.split('Bearer ')[1]

            const decoded = jwt.verify(token, JWT_SECRET)

            req.user = decoded

            next();
        }
        catch(err){
            res.status(500).json({message: err.message})
            console.log(err)
        }
        return
    }

    if(!token){
        return res.status(401).json({message: 'you should provide the authorization token'})
    }
}

module.exports = protect