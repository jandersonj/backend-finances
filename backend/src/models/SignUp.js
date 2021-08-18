const db = require('../database/database')
const bcrypt = require('bcryptjs')
const { v4 } = require('uuid');

class SignUp {
    
    async signup(name, senha, email){
        try {
 
            const hash = await bcrypt.hash(senha, 10)
            const id = v4()
            await db.insert({name, id:id, password: hash, email}).table("users")

        } catch (error) {
            console.log(error);
            return []
        }
    }
    async findByEmail(email){
        try {
             let result = await db.select('*').from("users").where({email: email})
             if (result.length > 0) {
                 return result[0]
             }else {
                 return undefined
             }
            
        } catch (error) {
            console.log(error);
            return undefined
        }
    }

    async findById(id){
        try {
            let result = await db.select('*').where({id: id}).table("users")
            if(result.length > 0){
                return result[0]
            }
        } catch (error) {
            return undefined + error
        }
    }
}

module.exports = new SignUp();