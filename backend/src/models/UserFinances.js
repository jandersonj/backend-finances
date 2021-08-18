const db = require('../database/database')
const bcrypt = require('bcryptjs');
const moment = require("moment")
const data = {}
class Finances {

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
    //consulta do saldo do mês atual
    async getSaldoById(id, month){
        try {
            let user =  await this.findById(id)
            
            const date = moment(month, 'YYYY-MM-DD')
            const firstDay = date.startOf('month').toISOString()
            const lastDay = date.endOf('month').subtract(1,'days').toISOString()
            if (user != undefined) {
                
                let soma = await db.raw(`select sum(valor) from lancamento inner join conta on lancamento.id_conta = conta.id where lancamento.tipo_lancamento = 'Receita' and conta.id = 1 and lancamento.id_user = '${user.id}' and created_at between '${firstDay}' and  '${lastDay}'`)
                let subs = await db.raw(`select sum(valor) from lancamento inner join conta on lancamento.id_conta = conta.id where lancamento.tipo_lancamento = 'Despesa' and conta.id = 1 and lancamento.id_user = '${user.id}' and created_at between '${firstDay}' and  '${lastDay}'`)
                let sumReceita = await db.sum('valor').from('lancamento').join('conta', 'conta.id', 'lancamento.id_conta').where({'id_user': user.id, 'tipo_lancamento': 'Receita', 'conta.id': 1 })
                let sumDespesa = await db.sum('valor').from('lancamento').join('conta', 'conta.id', 'lancamento.id_conta').where({'id_user': user.id, 'tipo_lancamento': 'Despesa', 'conta.id': 1 })
                let sumReceitaPoupança = await db.sum('valor').from('lancamento').join('conta', 'conta.id', 'lancamento.id_conta').where({'id_user': user.id, 'tipo_lancamento': 'Receita', 'conta.id': 2 }).whereBetween('created_at', [firstDay, lastDay])
                let sumDespesaPoupança = await db.sum('valor').from('lancamento').join('conta', 'conta.id', 'lancamento.id_conta').where({'id_user': user.id, 'tipo_lancamento': 'Despesa', 'conta.id': 2 }).whereBetween('created_at', [firstDay, lastDay])
                let despesaCategoria = await db.raw(`select sum(valor), categoria from lancamento where id_user = '${user.id}' and tipo_lancamento = 'Despesa' and id_conta = 1 and created_at between '${firstDay}' and '${lastDay}' group by categoria`)
                let receitaCategoria = await db.raw(`select sum(valor), categoria from lancamento where id_user = '${user.id}' and tipo_lancamento = 'Receita' and id_conta = 1 and created_at between '${firstDay}' and '${lastDay}' group by categoria`)
                if (soma != undefined && subs != undefined){

                    data.receita = soma.rows[0].sum || "0.00"
                    data.despesa = subs.rows[0].sum || "0.00"
                    data.saldo =  (data.receita - data.despesa) || "0.00"
                    data.receitaGeral = sumReceita[0].sum
                    data.despesaGeral = sumDespesa[0].sum
                    data.saldoGeral = (sumReceita[0].sum - sumDespesa[0].sum) || "0.00"
                    data.saldoPoupanca = (sumReceitaPoupança[0].sum - sumDespesaPoupança[0].sum) || '0.00'
                    data.receitaC = receitaCategoria.rows
                    data.despesaC = despesaCategoria.rows

                    return { data: data }
                }else {
                    return {status: false, error: "No return or error"}
                }
               
            }else {
                return {status: false, error: "Usuario não encontado"}
            }
            
           
        } catch (error) {
            console.log(error);
        }
    }

    //pega todos os lançamentos do mês corrente.
    async getAllRecords(id, month){
       try {
        let user =  await this.findById(id)
        const date = moment(month, 'YYYY-MM-DD')
        const firstDay = date.startOf('month').toISOString()
        const lastDay = date.endOf('month').subtract(1,'days').toISOString()
        if (user != undefined) { 
            let lancamento = await db.select(['l.id', 'categoria', 'descricao', 'tipo_lancamento', 'valor', 'created_at', 'id_conta', 'conta'])
            .from('lancamento as l')
            .join('conta as c', 'l.id_conta', 'c.id')
            .where({
                'id_user': user.id
            })
            .whereBetween('created_at', [firstDay, lastDay])
            .orderBy('created_at', 'desc')
            return lancamento
        }else {
            return {status: false, erro: "Usuário não encontrado"}
        }
       } catch (error) {
           console.log(error);
       }
    }

    //lancamento de despesa e receita 
    async lancamento(tipo_lancamento, descricao, categoria, valor, id_user, id_conta){
        try {
            let user =  await this.findById(id_user)

            if (user != undefined) {
                let result = await db.insert({
                    'tipo_lancamento' : tipo_lancamento,
                    'descricao' : descricao,
                    'categoria' : categoria,
                    'valor' : valor,
                    'id_user' : id_user,
                    'id_conta' : id_conta ,
                }).table("lancamento")

                if (result) {
                    return {status: true, msg: "Ok insert lancamento"}
                }else {
                    return {status: false, msg: "Not ok insert lancamento"}
                }

            }else {
                return {status: false, erro: "Usuário não encontrado"}
            }
        } catch (error) {
            console.log(error);
        }
    }

    //filtro de registro por intervalo de data
    async filterLancaemtentoDate(id, data1, data2){
        let user =  await this.findById(id)
        let date = await db.select('*')
        .where({'id_user': user.id })
        .whereBetween('created_at',[ data1, data2 ])
        .table('lancamento')
        .orderBy('created_at', 'asc')
        
        if (date != undefined) {
            return date
            
        } else {
            return {status: false,}
        }
    }

    async filterLancaemtenByTipo(id, tipo){
        let user =  await this.findById(id)
        let query = await db.select('*')
        .where({'id_user': user.id, tipo_lancamento: tipo })
        .table('lancamento')
        .orderBy('created_at', 'asc')
        
        if (query != undefined) {
            return query
            
        } else {
            return {status: false,}
        }
    }


    //editar lancamento
    async updateLancamento(id, tl,desc, categoria, valor, id_reg){
        
        try {
            let user =  await this.findById(id)
            let lancamento =  {}
            if (tl != undefined) {
                lancamento.tipo_lancamento = tl
            }
            if (desc != undefined) {
                lancamento.descricao = desc
            }
            if (categoria != undefined) {
                lancamento.categoria = categoria
            }
            if (valor != undefined) {

                lancamento.valor = valor
            }

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            lancamento.updated_at = today

            let result = await db.update(lancamento).where({id_user:user.id, id:id_reg}).table("lancamento")
            if (result) {
                return {status: true, msg: "Sucesso na edição"}
            }else {
                return {status: false, err: "Erro na edição do registro"}
            }
        } catch (error) {
            console.log(error);
        }
        
    }

    //deletar lancamento
    async deleteLancamento(id){
        try {
            let lancamento = await db.raw(`delete from lancamento where id = ${id}`)
            if (lancamento) {
                return {msg: "Deletado com sucesso!"}
            }else {
                return {status: false, err: "error ao deletar o registro!"}
            }
            
        } catch (error) {
            return {status: false, err:error}
        }
    }

    async getName(id){
    try {
        let n  =  await this.findById(id)
        let user = await db.select("name").from("users").where("id", n.id)
        if (user != undefined) {
            return user
        }

        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new Finances();