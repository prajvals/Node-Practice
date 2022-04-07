const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app2');
// const portNumber = 4008;
// app.use(dot)

// console.log(process.env);
const portNumber = process.env.PORT;
app.listen(portNumber, () => {
  console.log('Yeah we are live');
});
