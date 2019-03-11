const debug = require('debug')('backend:proxy');
const Url = require('url-parse');
const https = require('https');

// default option set
let REQ_OPTIONS = {
    host: null,
    port: null,
    method: null,
    path: null,
    rejectUnauthorized: false,
    headers: null
}

/**
 * Create new Request options
 * @param {Url} uri 
 * @param {string} method 
 */
function createNewReqOptions(uri, method) {
    let ops = REQ_OPTIONS;

    ops.host = uri.hostname || null;
    ops.port = uri.port || 443;
    ops.path = uri.pathname || '';
    ops.method = method || 'GET';
    ops.rejectUnauthorized = false;
    ops.headers = {
        "Content-Type": "application/json"
    }

    return ops;
}

var Proxy = /** @class */ (function () {
    
    function Api(options) {
        this.token = null;
        this.baseUrl = options + '' || '';

        debug('Init using base url ', this.baseUrl);
    }

    Api.prototype.get = function(path, callback) {
        const fullUrl = this.baseUrl + path;
        const uri = new Url(fullUrl);

        debug("URI", uri);

        let ops = createNewReqOptions(uri, "GET");

        debug("Sending GET request %o", ops);

        https.request(ops, (response) => {
            let str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });
        
            response.on('end', function () {
                debug("Got data, raw output %o", str);

                // needs validation
                let jsonData = str ? JSON.parse(str) : null;

                return callback(response, jsonData);
            });
        // the end
        // request.end() will completed before
        // the entire message response is received
        }).end();
    }

    Api.prototype.post = function(path, data, callback) {
        const fullUrl = this.baseUrl + path;
        const uri = new Url(fullUrl);

        debug("URI", uri);

        let ops = createNewReqOptions(uri, "POST");

        let body = JSON.stringify(data);
        ops.headers['content-length'] = body.length;

        debug("Sending POST request %o", ops);

        let postReq = https.request(ops, (response) => {
            let str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });
        
            response.on('end', function () {
                debug("Got data, raw output %o", str);

                // needs validation
                let jsonData = str ? JSON.parse(str) : null;

                return callback(response, jsonData);
            });
        })

        // during POST request
        // send data to target server
        postReq.write(body);

        // the end
        // request.end() will completed before
        // the entire message response is received
        postReq.end();
    }

    return Api;
}());

module.exports.Proxy = Proxy;
