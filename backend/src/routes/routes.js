const express = require('express')
const router = express.Router()


//controllers
const User = require('../Controllers/userController')
const Finance = require('../Controllers/financesController.js')
//middlewares
const tokenAuth = require('../middlewares/authLogin')



//endpoint de autenticação para login
router.post('/user/authLogin', User.login)

//rota para signup
router.post('/user/signup', User.signup)

//endpoint para editar usuário
router.put('/user/:id', tokenAuth, User.editUser)
router.put('/user/password/:id', tokenAuth, User.changePassword)

//endpoint para editar usuário
router.delete('/user/:id', tokenAuth, User.delete)

//rota para pegar nome do usuário
router.get('/user/name/:id', tokenAuth, Finance.getNome)

//rota home
router.get('/user/data/:id/:month', tokenAuth, Finance.getMainData)

//rota para lancamentos 
router.get('/user/data/getRecords/:id/:month', tokenAuth, Finance.getAllRecords)

//registro de lançamento
router.post('/user/data/lancamento/:id', tokenAuth, Finance.lancamento)

//filtro para lancamento
router.get('/user/data/filter/:id', tokenAuth, Finance.filterLancamento)

//filtro para lancamento
router.get('/user/data/tipo/:id', tokenAuth, Finance.filterLancamentoByTipo)

//editando registro de lancamento
router.put('/user/data/lancamento/:id', tokenAuth, Finance.updateRegistro)

//deletando registro de lancamento
router.delete('/user/data/lancamento/:id', tokenAuth, Finance.delete)

router.post('/user/validate', tokenAuth, Finance.validate)

module.exports = router



