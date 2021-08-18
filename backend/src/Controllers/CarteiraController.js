const Carteira = require('../models/Carteira')

class CariteiraController {
    
    async addCarteira(req,res){
        try {

            const {nome, vl} = req.body
            const {c_id} = req.params
            let result = await Carteira.addCarteira(nome,vl,c_id)
            if (result.status) {
                res.status(200)
                res.json(result)
            } else {
                res.status(401)
                res.json(result.err)
            }
            
        } catch (error) {
            
            console.log(error);
        }

    }

    async addMoneyToCarteira(req, res){

        try {

            const { valor, c_id } = req.body

            const { id } = req.params
            let result = await Carteira.addMoneyToCarteira(valor, c_id, id)

            if (result.status) {

                res.status(200)

                res.json(result)
            }else {
                res.status(406)

                res.json(result.err)
            }

        } catch (error) {

            console.log(error);
        }

    }
    
}

module.exports = new CariteiraController()