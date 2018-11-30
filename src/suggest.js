const dbQuery = require('./db-query');

/** add new suggested command */
async function suggest(req, res, reqUrl) {
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
        let data = JSON.parse(chunk);
        console.log(data);

    });

    res.writeHead(200);
    res.write('Yes, there is a response..\n');
    res.end();
}

module.exports = suggest;
