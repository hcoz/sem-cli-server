/** add new suggested command */
function suggest(req, res, reqUrl) {
    res.writeHead(200);
    res.write('Yes, there is a response..\n');
    res.end();
}

module.exports = suggest;
