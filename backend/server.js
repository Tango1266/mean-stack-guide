const http = require('http');
const app = require('./app');


const port = process.env.PORT || 3000;

app.set('port',port);
const server = http.createServer(app);

// process.env.PORT will be set from a web hosting provider
server.listen(port);