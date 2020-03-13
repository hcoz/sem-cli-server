const http = require('http');

const inquire = require('./src/inquire');
const suggest = require('./src/suggest');
const noResponse = require('./src/no-response');

const port = process.env.PORT || 8080;

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
    redirectedFunc({ req, res, reqUrl });
}).listen(port, () => {
    console.log('Server is running at port:', port);
});
