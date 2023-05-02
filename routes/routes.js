require('dotenv').config()

const express = require('express');
const router = express.Router()
module.exports = router;
const modeloTarefa = require('../models/tarefa');

// TODO getALL update delete

let backup = {
    acao: 'NONE',
    edit: []
}

router.post('/post', verificaJWT, async (req, res) => {
    const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada
    })
    try {
        const tarefaSalva = await objetoTarefa.save();
        res.status(200).json(tarefaSalva)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
   });

router.get('/getAll', verificaJWT, async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.delete('/delete/:id', verificaJWT, async (req, res) => {
    try {
        const id = req.params.id
        backup.acao = 'DELETE'
        const resultado = await modeloTarefa.findByIdAndDelete(id)
        backup.edit[0] = resultado
        console.log(backup)
        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
   });

router.patch('/undo', verificaJWT, async (req,res) =>{
    try{
        
    } catch (error){
        res.status(400).json({ message: error.message })
    }
})

router.patch('/update/:id', verificaJWT, async (req, res) => {
    try {
        const id = req.params.id;
        const novaTarefa = req.body;
        const options = { new: true };
        const result = await modeloTarefa.findByIdAndUpdate(
        id, novaTarefa, options
        )
        res.json(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
   });

router.get('/encontrarPorParteDaDescricao/:desc', verificaJWT, async (req,res) => {
    try{
        const desc = req.params.desc;
        const result = await modeloTarefa.find({descricao: { $regex: desc}})
        res.json(result)
    } catch(error){
        res.status(400).json({ message: error.message })
    }
});

router.delete('/removeAll', verificaJWT, async(req,res) =>{
    try{
        const result = await modeloTarefa.deleteMany();
        res.json(result)
    } catch (error){
        res.status(400).json({ message: error.message })
    }
});

router.delete('/removeAllDone', verificaJWT, async(req,res) =>{
    try{
        const result = await modeloTarefa.deleteMany({statusRealizada: true});
        res.json(result)
    } catch (error){
        res.status(400).json({ message: error.message })
    }
});

//Autorizacao
function verificaUsuarioSenha(req, res, next) {
    if (req.body.nome !== 'branqs' || req.body.senha !== '1234') {
    return res.status(401).json({ auth: false, message: 'Usuario ou Senha incorreta' });
    }
    next();
   }

//Nova forma de Autorizacao
function verificaJWT(req, res, next) {
    const token = req.headers['id-token'];
    if (!token) return res.status(401).json({
    auth: false, message: 'Token nao fornecido'
    });
    jwt.verify(token,process.env.TOKEN_GENERATOR, function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Falha !' });
    next();
    });
   }
   

//Autenticacao
var jwt = require('jsonwebtoken');
router.post('/login', (req, res, next) => {
 if (req.body.nome === 'branqs' && req.body.senha === '1234') {
 const token = jwt.sign({ id: req.body.nome }, process.env.TOKEN_GENERATOR, { expiresIn: 300 });
 return res.json({ auth: true, token: token });
 }
 res.status(500).json({ message: 'Login invalido!' });
})

   