const jwt = require('jsonwebtoken')
const JWT_SECRET = "abcDfEhb,.;/15987abcDKIlç~"

module.exports = function verifyToken(req,res,next){

    const token = req.headers['authorization']
    if (token != undefined) {
        const bearer = token.split(' ')
        let auth = bearer[1]
        
        try {
            jwt.verify(auth, JWT_SECRET)
            next();

        } catch (error) {
            res.status(401)
            res.json({err: "Unauthorized: Token não válido"})
            return;
        }
    }else {
        res.status(403)
        res.send("Não autorizado")
        return
    }
}