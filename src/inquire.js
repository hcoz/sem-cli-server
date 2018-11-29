const https = require('https');

const dbQuery = require('./db-query');

/** send request to wit.ai to find message intent */
function inquireWit(options) {
    return new Promise((resolve, reject) => {
        let intent = { confidence: 0 };

        const witReq = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                let data = JSON.parse(chunk);

                if (!data.entities || !data.entities.intent) {
                    reject('no intent.');
                    witReq.end();
                    return;
                }
                for (let item of data.entities.intent) {
                    if (!item || item.confidence > intent.confidence) {
                        intent = item;
                    }
                }
                resolve(intent);
            });
        });

        witReq.on('error', (e) => {
            console.log('problem with request: ' + e.message);
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
        path: '/message' + reqUrl.search,
        headers: {
            'Authorization': process.env.WITAI_ACCESS_TOKEN
        }
    };

    try {
        let intent = await inquireWit(options);
        let command = await dbQuery(intent.value, reqUrl.searchParams.get('os'));
        // send the response
        res.writeHead(200);
        res.write('your command: ' + JSON.stringify(command));
        res.end();
    } catch (err) {
        console.error(err);
        // send the response
        res.writeHead(400);
        res.write('error occured: ' + err);
        res.end();
    }
}

module.exports = inquire;