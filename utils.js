const fs = require('fs');

const writeDataToFile = (filename, content) => {
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
        if(err) console.log(err);
    })
}

const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        try {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
                if(body.length > 1e6) {
                    req.connection.destroy();
                }
            });

            req.on('end', () => {
                resolve(body);
            });
        } catch (err) {
            console.log(err);
        }
    })
}

module.exports = {
    writeDataToFile,
    getPostData
}