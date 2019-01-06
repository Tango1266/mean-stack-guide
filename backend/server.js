const http = require('http');
const app = require('./app');
const debug = require('debug')("node-angular");

const normalizePort = val => {
    // validates port number
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const addr = server.address();
    const bind = typeof  addr === "string" ? "pipe" + addr : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + "is already in use");
            process.exit(1);
            break;
        default:
            throw error;

    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe" + addr: "port " + port;
    debug("Listening on " + bind)
};

// process.env.PORT will be set from a web hosting provider
// default host address: http://localhost:3000
const port = normalizePort(process.env.PORT || process.env.DEFAULT_PORT || 3000);
app.set('port',port);

const server = http.createServer(app);
//register listener
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);