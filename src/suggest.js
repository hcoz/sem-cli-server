const { insert } = require('./db-query');
const constants = require('./constants.json');

/** add new suggested command */
function suggest({ req, res }) {
    req.setEncoding('utf8');
    req.on('data', async (chunk) => {
        let data = JSON.parse(chunk);

        try {
            await insert(data.intent, data.os, data.command, data.dangerLevel);
            // send the response
            res.writeHead(200);
            res.write(constants.THANKS);
            res.end();
        } catch (err) {
            console.error(err);
            // send the response
            res.writeHead(400);
            console.error(JSON.stringify(err));
            res.write(constants.ERROR);
            res.end();
        }
    });
}

module.exports = suggest;
