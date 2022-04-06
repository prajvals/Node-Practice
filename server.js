const app = require('./app2');
const portNumber = 4008;

app.listen(portNumber, () => {
  console.log('Yeah we are live');
});
