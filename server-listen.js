require('dotenv').config();
const app = require('./server.js');

app.listen(process.env.PORT, () => console.log(`Server on localhost ${process.env.PORT}...`));
