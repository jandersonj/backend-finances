const { urlencoded} = require('express')
const express = require('express')
var cors = require('cors')
const app = express()
const router = require('./routes/routes')
app.use('*',cors())

app.use(express.json())
app.use(urlencoded({extended: true}))
app.use('/api', router)
const PORT = process.env.PORT || 3000
app.listen(PORT, (req,res)=> {
    console.log('Servidor rodando');
})
