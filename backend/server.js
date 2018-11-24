const http = require('http');

const server = http.createServer(
    (request, response) => {
        // func which gets executed on every request
        response.end('First response.')

    });

// process.env.PORT will be set from a web hosting provider
server.listen(process.env.PORT || 3000);