const http = require('http');

const port = process.env.PORT || 8080;

/** search for a given parameter and send the response */
function inquire(req, res) {
    res.writeHead(200);
    res.write('Yes, there is a response..\n');
    res.end();
}

/** if there is no related function which handles the request, then show error message */
function noResponse(req, res) {
    res.writeHead(404);
    res.write('Sorry, but we have no response..\n');
    res.end();
}

http.createServer((req, res) => {
    // create an object for all redirection options
    const funcRedirect = {
        'GET/inquire': inquire,
        'default': noResponse
    };
    // parse the url by using WHATWG URL API
    let reqUrl = new URL(req.url, 'http://127.0.0.1/');
    // find the related function by searching "method + pathname" and run it
    let redirectedFunc = funcRedirect[req.method + reqUrl.pathname] || funcRedirect['default'];
    redirectedFunc(req, res);
}).listen(port);

console.log('Server is running at port:', port);
