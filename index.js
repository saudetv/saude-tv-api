const app = require('./src/config/express')();
const port = app.get('port');

// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA
app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to our glorious app',
}));
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});