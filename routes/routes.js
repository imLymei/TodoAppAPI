const express = require('express');
const router = express.Router()
module.exports = router;
const modeloTarefa = require('../models/tarefa');

// TODO getALL update delete

let backup = {
    acao: 'NONE',
    edit: []
}

router.post('/post', async (req, res) => {
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

router.get('/getAll', async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.delete('/delete/:id', async (req, res) => {
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

router.patch('/undo', async (req,res) =>{
    try{
        
    } catch (error){
        res.status(400).json({ message: error.message })
    }
})

router.patch('/update/:id', async (req, res) => {
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

router.get('/encontrarPorParteDaDescricao/:desc', async (req,res) => {
    try{
        const desc = req.params.desc;
        const result = await modeloTarefa.find({descricao: { $regex: desc}})
        res.json(result)
    } catch(error){
        res.status(400).json({ message: error.message })
    }
});

router.delete('/removeAll', async(req,res) =>{
    try{
        const result = await modeloTarefa.deleteMany();
        res.json(result)
    } catch (error){
        res.status(400).json({ message: error.message })
    }
});

router.delete('/removeAllDone', async(req,res) =>{
    try{
        const result = await modeloTarefa.deleteMany({statusRealizada: true});
        res.json(result)
    } catch (error){
        res.status(400).json({ message: error.message })
    }
});