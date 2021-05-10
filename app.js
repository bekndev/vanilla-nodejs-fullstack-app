const http = require('http');
const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');

const server = http.createServer((req, res) => {
    if(req.url.match('^' + /api/)) {
        apiRoutes(req, res);
    } else {
        webRoutes(req, res);
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`App running at http://localhost:${PORT}/`));