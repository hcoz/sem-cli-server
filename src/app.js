const http = require('http');
const https = require('https');

const port = process.env.PORT || 8080;

/** send request to wit.ai to find message intent */
function inquireWit(options) {
    return new Promise((resolve, reject) => {
        let intent = { confidence: 0 };

        const witReq = https.request(options, (res) => {
            // console.log('STATUS: ' + res.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log('BODY: ' + chunk);
                let data = JSON.parse(chunk);

                if (!data.entities || !data.entities.intent) {
                    reject('no intent.');
                    return;
                }
                for (let item of data.entities.intent) {
                    if (!item || item.confidence > intent.confidence) {
                        intent = item;
                    }
                }
                resolve(intent);
            });
            res.on('end', () => {
                console.log('No more data in response.');
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
function inquire(req, res, reqUrl) {
    // query wit.ai for requested message
    const options = {
        hostname: 'api.wit.ai',
        method: 'GET',
        path: '/message' + reqUrl.search,
        headers: {
            'Authorization': 'Bearer N6UA7PZD5735RW6BUKMEOWIELE7MCDDH'
        }
    };

    inquireWit(options)
        .then((intent) => {
            // send the response
            res.writeHead(200);
            res.write('your command: ' + JSON.stringify(intent));
            res.end();
        })
        .catch((err) => {
            console.log(err);
            // send the response
            res.writeHead(400);
            res.write('error occured: ' + err);
            res.end();
        });
}

/** add new suggested command */
function suggest(req, res, reqUrl) {
    res.writeHead(200);
    res.write('Yes, there is a response..\n');
    res.end();
}

/** if there is no related function which handles the request, then show error message */
function noResponse(req, res, reqUrl) {
    res.writeHead(404);
    res.write('Sorry, but we have no response..\n');
    res.end();
}

http.createServer((req, res) => {
    // create an object for all redirection options
    const router = {
        'GET/inquire': inquire,
        'POST/suggest': suggest,
        'default': noResponse
    };
    // parse the url by using WHATWG URL API
    let reqUrl = new URL(req.url, 'http://127.0.0.1/');
    // find the related function by searching "method + pathname" and run it
    let redirectedFunc = router[req.method + reqUrl.pathname] || router['default'];
    redirectedFunc(req, res, reqUrl);
}).listen(port, () => {
    console.log('Server is running at port:', port);
});
