require('dotenv').config()

const express = require('express');
const app = express();
const modeloTarefa = require('./models/tarefa');

app.use((req, res, next) => {
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE');
 res.header(
 "Access-Control-Allow-Headers",
 "Origin, X-Requested-With, Content-Type, Accept"
 );
 next();
});
app.use(express.json());
const PORT = process.env.PORT || 3000;
const routes = require('./routes/routes');
//app.use('/api', routes);

app.post('/post', async (req, res) => {
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

app.get('/getAll', async (req, res) => {
  try {
      const resultados = await modeloTarefa.find();
      res.json(resultados)
  }
  catch (error) {
      res.status(500).json({ message: error.message })
  }
});

app.get('/', async (req, res) => {
  res.status(200).json({ message: "working :)" })
});

app.delete('/delete/:id', async (req, res) => {
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

app.patch('/undo', async (req,res) =>{
  try{
      
  } catch (error){
      res.status(400).json({ message: error.message })
  }
})

app.patch('/update/:id', async (req, res) => {
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

app.get('/encontrarPorParteDaDescricao/:desc', async (req,res) => {
  try{
      const desc = req.params.desc;
      const result = await modeloTarefa.find({descricao: { $regex: desc}})
      res.json(result)
  } catch(error){
      res.status(400).json({ message: error.message })
  }
});

app.delete('/removeAll', async(req,res) =>{
  try{
      const result = await modeloTarefa.deleteMany();
      res.json(result)
  } catch (error){
      res.status(400).json({ message: error.message })
  }
});

app.delete('/removeAllDone', async(req,res) =>{
  try{
      const result = await modeloTarefa.deleteMany({statusRealizada: true});
      res.json(result)
  } catch (error){
      res.status(400).json({ message: error.message })
  }
});

app.listen(PORT, () => {
 console.log(`Server Started at ${PORT}`)
})
// Obtendo os parametros passados pela linha de comando
var userArgs = process.argv.slice(2);
var mongoURL = process.env.MONGODB_URL
//Configurando a conexao com o Banco de Dados
var mongoose = require('mongoose');
mongoose.connect(mongoURL, {
 useNewUrlParser: true, useUnifiedTopology:
 true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', (error) => {
 console.log(error)
})
db.once('connected', () => {
 console.log('Database Connected');
})

module.exports = app;