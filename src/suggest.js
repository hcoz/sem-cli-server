const { insert } = require('./db-query');

/** add new suggested command */
function suggest(req, res, reqUrl) {
    req.setEncoding('utf8');
    req.on('data', async (chunk) => {
        let data = JSON.parse(chunk);

        try {
            await insert(data.intent, data.os, data.command, data.dangerLevel);
            // send the response
            res.writeHead(200);
            res.write('your command is added');
            res.end();
        } catch (err) {
            console.error(err);
            // send the response
            res.writeHead(400);
            console.error(JSON.stringify(err));
            res.write('error occured');
            res.end();
        }
    });
}

module.exports = suggest;
