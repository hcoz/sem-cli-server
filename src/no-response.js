/** if there is no related function which handles the request, then show error message */
function noResponse(req, res, reqUrl) {
    res.writeHead(404);
    res.write('Sorry, but we have no response..\n');
    res.end();
}

module.exports = noResponse;
