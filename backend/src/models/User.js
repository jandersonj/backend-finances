var db = require('../database/database')
const bcrypt = require('bcryptjs')
class Usuario{

    async login(nome) {
        
        try {
            
            let result = await db.select(['id','name', 'password', 'email']).from("users").where({name: nome })
            return result[0]
        } catch (error) {
            console.log(error);
            return []
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

    async editUser(name,email,id){
        try {
            let user = await this.findById(id)
            let edit = {}
            if (user !=  undefined) {
                if (name != undefined) {
                    edit.name = name
                }
                if (email != undefined) {
                    edit.email = email
                }
                await db.update(edit).where({id: user.id}).table("users")
                return {status: "OK UPDATE"}
            }

        } catch (error) {
            return {status: false, err:error}
        }
    }

    async changePassword(pass, id){
        try {

            const senha = await bcrypt.hash(pass, 10)
            let user = await this.findById(id)
            if (user != undefined) {
                if (senha != undefined) {
                    await db.update({senha: senha}).where({id: user.id}).table("users")
                    return {status : "senha editada"}
                }else {
                    return {status: false}
                }
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    async deleteUser(id){
        try {

            let user = await this.findById(id)

            if (user != undefined) {
                await db.delete().where({id: user.id}).table("users")
                return {status: "OK DELETADO"}
            }else {
                return {status: false, err: "error"}
            }
            
        } catch (error) {
            return {status: false, err:error}
        }
    }
}

module.exports = new Usuario()