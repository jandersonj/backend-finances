const jwt = require('jsonwebtoken')
const JWT_SECRET = "abcDfEhb,.;/15987abcDKIlç~"
const bcrypt = require('bcryptjs')

//import models
const User = require('../models/User')
const register = require('../models/SignUp')

class UserController {

    async login(req, res) { 
        try {
            const {nome, pass} = req.body
            
            let user = await User.login(nome)
            if (user != undefined) {
               let result =  await bcrypt.compare(pass, user.password)
                if (result) {
                    
                    jwt.sign({email: user.email, id: user.id}, JWT_SECRET, {expiresIn: '3h'}, (err, token)=>{
                        if (err) {
                            res.status(400)
                            res.json({err: "Falha na criação do token"})
                        }else {
                            res.status(200)
                            res.json({token: token, uuid: user.id})
                        }
                    }) 
                }else {
                    res.status(200)
                    res.json({err: "Password Inválido"})
                }
            }else {
                res.status(200)
                res.json({err: "Usuário Inválido"})
            }  

        } catch (error) {
               console.log(error);
        }
            
    }

    async signup(req, res){

        try {
          let {nome, pass, email} = req.body

          let result = await User.findByEmail(email)
          if (result) {
              res.status(200)
              res.json({err: "Email já está cadastrado"})
              return
          }

          await register.signup(nome,pass,email)
          res.status(200)
          res.json({msg: "Cadastro realisado com sucesso"})
            
        } catch (error) {
            console.log(error);
        }
    }

    async editUser(req, res){
    
        try {
            const { nome,email } = req.body
            const id = req.params.id
            let result = await User.editUser(nome,email, id)
            if (result != undefined) {
                if (result.status) {
                    res.status(200)
                    res.send("editado com sucesso")
                }else {
                    res.status(406)
                    res.json(result.err)
                }
            }else {
                res.status(406)
                res.json({err: "erro no servidor ou usuário não encontrado"})
            }
        } catch (error) {
            console.log(error);
        }
        
    }

    async changePassword(req,res){
        try {
            const { pass } = req.body
            const id = req.params.id
            let result = await User.changePassword(pass, id)
            if (result != undefined) {
                if (result.status) {
                    res.status(200)
                    res.send("senha editada com sucesso")
                }else {
                    res.status(406)
                    res.json(result.err)
                }
            }else {
                res.status(406)
                res.json({err: "erro na edição da senha"})
            }
        } catch (error) {
            console.log(error);
        }
    }

    async delete(req,res){
        try {

            const { id } = req.params
            let result = await User.deleteUser(id)
            if (result != undefined) {
                res.status(200)
                res.send("deletado com sucesso")
            }else {
                res.status(200)
                res.send("Usuário não encontrado")
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new UserController()