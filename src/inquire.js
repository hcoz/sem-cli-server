const https = require('https');

const { search } = require('./db-query');
const constants = require('./constants.json');

/** send request to wit.ai to find message intent */
function inquireWit(options) {
    return new Promise((resolve, reject) => {
        let intent = { confidence: 0 };

        const witReq = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                let data = JSON.parse(chunk);

                if (!data.entities || !data.entities.intent) {
                    reject(constants.NO_RELATED_COMMAND);
                    witReq.end();
                    return;
                }
                // select the intent which has highest confidence value
                for (let item of data.entities.intent) {
                    if (!item || item.confidence > intent.confidence) {
                        intent = item;
                    }
                }
                //if the confidence value of this intent lower than threshold return reject
                if (intent.confidence < 0.9) {
                    reject(constants.NO_RELATED_COMMAND);
                } else {
                    resolve(intent);
                }
            });
        });

        witReq.on('error', (e) => {
            console.error(constants.WITAI_ERROR, e.message);
            reject(e.message);
        });

        witReq.end();
    });
}

/** search for a given parameter and send the response */
async function inquire(req, res, reqUrl) {
    // query wit.ai for requested message
    const options = {
        hostname: 'api.wit.ai',
        method: 'GET',
        path: '/message' + reqUrl.search + '&v=20200313',
        headers: {
            'Authorization': process.env.WITAI_ACCESS_TOKEN
        }
    };

    try {
        let intent = await inquireWit(options);
        console.log('intent: ', intent);
        let command = await search(intent.value, reqUrl.searchParams.get('os'));
        console.log('command: ', command);
        // send the response
        res.writeHead(200);
        res.write(JSON.stringify(command));
        res.end();
    } catch (err) {
        console.error(err);
        // send the response
        res.writeHead(400);
        console.error(JSON.stringify(err));
        res.write(constants.ERROR);
        res.end();
    }
}

module.exports = inquire;
