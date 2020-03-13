const constants = require('./constants.json');

/** if there is no related function which handles the request, then show error message */
function noResponse({ res }) {
    res.writeHead(404);
    res.write(constants.NO_RESPONSE);
    res.end();
}

module.exports = noResponse;
