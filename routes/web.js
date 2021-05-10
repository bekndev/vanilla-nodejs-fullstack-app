const fs = require('fs');
const path = require('path');

const webRoutes = (req, res) => {
    const dirname = __dirname + '/../public';
    let filePath = path.join(
        dirname, 
        req.url === '/' ? 'index.html' : req.url
    );
    let extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch(extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    
    if(req.url == '/') {
        // Get homepage
        fs.readFile(
            path.join(dirname, 'index.html'),
            (err, content) => {
                if(err) throw err;
                
                res.writeHead(200, {'Content-type': contentType});
                res.end(content);
            }
        );
    } else if(extname != '') {
        // Get static files
        fs.readFile(
            path.join(dirname, req.url),
            (err, content) => {
                if(err) {
                    // Static file not found
                    res.statusCode = 404;
                    res.end();
                    // throw err;
                }

                res.writeHead(200, {'Content-type': contentType});
                res.end(content);
            }
        );
    } else {
        // Page 404
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('<h1>Oops!</h1><p>404 - page not found</p><br /><a href="/">Go to homepage</a>');
    }
}

module.exports = webRoutes;