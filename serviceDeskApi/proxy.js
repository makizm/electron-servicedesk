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
        "Content-Type": "application/json",
        "X-ExperimentalApi": "opt-in",
        "Cookie": "",
    }

    return ops;
}

var Proxy = /** @class */ (function () {
    
    function Api(options) {
        this.token = null;
        this.baseUrl = options + '' || '';

        debug('Init using base url ', this.baseUrl);
    }

    Api.prototype.get = function(path, auth, callback) {
        // allow overload to make 'auth' optional
        let _callback = (callback === null || callback === undefined) ? auth : callback;

        if (typeof _callback !== 'function') {
            throw new Error('Must provide valid callback function');
        }

        const fullUrl = this.baseUrl + path;
        const uri = new Url(fullUrl);

        debug("URI", uri);

        let ops = createNewReqOptions(uri, "GET");

        // authentication data provided
        if (callback && typeof auth === 'string') {
            debug('Custom auth', auth);
            ops.headers.Cookie = auth;
        }

        debug("Sending GET request %o", ops);

        https.request(ops, (response) => {
            let str = '';

            debug("Received response with status code ", response.statusCode);

            response.on('data', function (chunk) {
                str += chunk;
            });
        
            response.on('end', function () {
                debug("Got data, raw output %o", str);

                let jsonData = null;

                try {
                    jsonData = JSON.parse(str);
                } catch (error) {
                    jsonData =  { errorMessages: [response.statusMessage] };
                    debug("Failed to parse response data", error);
                }

                return _callback(response, jsonData);
            });
        // the end
        // request.end() will completed before
        // the entire message response is received
        }).end();
    }

    Api.prototype.post = function(path, data, auth, callback) {
        // allow overload to make 'auth' optional
        let _callback = (callback === null || callback === undefined) ? auth : callback;

        if (typeof _callback !== 'function') {
            throw new Error('Must provide valid callback function');
        }

        const fullUrl = this.baseUrl + path;
        const uri = new Url(fullUrl);

        debug("URI", uri);

        let ops = createNewReqOptions(uri, "POST");

        // authentication data provided
        if (callback && typeof auth === String) {
            ops.headers.cookie = auth;
        }

        let body = JSON.stringify(data);
        ops.headers['content-length'] = body.length;

        debug("Sending POST request %o", ops);

        let postReq = https.request(ops, (response) => {
            let str = '';

            debug("Received response with status code ", response.statusCode);

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                debug("Got data, raw output %o", str);

                let jsonData = null;

                try {
                    jsonData = JSON.parse(str);
                } catch (error) {
                    jsonData =  { errorMessages: [response.statusMessage] };
                    debug("Failed to parse response data", error);
                }

                return _callback(response, jsonData);
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
