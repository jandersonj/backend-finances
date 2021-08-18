const jwt = require('jsonwebtoken')
const Data = require('../models/UserFinances')
class DashboardData{

    async getNome(req,res){
        try {
            const {id}  = req.params
            let result = await Data.getName(id)
            if (result) {

                res.status(200)
                res.send(result)

            }else{
                res.status(401)
                res.json({err: "Sem resultado à mostrar"})
            }
            
            
        } catch (error) {
            console.log(error);
        }
    }

    async getMainData(req,res){
        try {
            const { id, month }  = req.params
            let result = await Data.getSaldoById(id, month)
            if (result) {

                res.status(200)
                res.json(result)

            }else{
                res.status(401)
                res.json({err: "resultado não encontrado"})
            }
            
            
        } catch (error) {
            console.log(error);
        }
    }

    async lancamento(req, res) {
        try {
            const { tipo, desc, categoria, valor, id_conta, data} = req.body
            const id = req.params.id
            let result =  await Data.lancamento(tipo, desc, categoria, valor, id, id_conta, data)
            if (result) {
                res.status(200)
                res.json({msg: "Inserido com sucesso!"})
            }else {
                res.status(401)
                res.json({err: "Erro ocorreu ao inserir o lancamento"})
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getAllRecords(req, res){
        try {
            const { id, month } = req.params
            let result = await Data.getAllRecords(id, month)
            if (result) {
                res.status(200)
                res.json(result)
            }else {
                res.status(401)
                res.json({err: "Erro ocorreu ao inserir o lancamento"})
            }
        } catch (error) {
            console.log(error);
        }
    }

    async filterLancamento(req,res){
        try {
            const { data1, data2 } = req.body
            const id = req.params.id
            let result = await Data.filterLancaemtentoDate(id, data1, data2)
            if (result) {
                res.status(200)
                res.json(result)
            }else {
                res.status(200)
                res.send("Nenhum resulta a mostrar: filter")
            }
        } catch (error) {
            console.log(error);
        }
    }

    async filterLancamentoByTipo(req,res){
        try {
            const { tipo } = req.body
            const id = req.params.id
            let result = await Data.filterLancaemtenByTipo(id, tipo)
            if (result) {
                res.status(200)
                res.json(result)
            }else {
                res.status(200)
                res.send("Nenhum resulta a mostrar: filter")
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateRegistro(req,res) {
        try {
            const {id_reg, tl, desc, categoria, valor} = req.body
            const id = req.params.id
            let response = await Data.updateLancamento(id, tl, desc, categoria, valor, id_reg)
            if (response != undefined) {
                if (response.status) {
                    res.status(200)
                    res.send("Editado com sucesso !")
                }else {
                    res.status(406)
                    res.send(response.err)
                }
            } else {
                res.status(406)
                res.json({err: "erro no servidor ou usuário não encontrado"})
            }
        } catch (error) {
            console.log(error);
        }
    }

    async delete(req,res){
        try {
            const { id }  = req.params
            let result = await Data.deleteLancamento(id)
            if (result != undefined) {
                res.status(200)
                res.send("deletado com sucesso")
            }else {
                res.status(200)
                res.send("Registro não encontrado")
            }
        } catch (error) {
            console.log(error);
        }
    }

    async validate(req,res) {
        res.send('ok')
    }
}

module.exports = new DashboardData()