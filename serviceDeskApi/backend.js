"use strict";
const debug = require('debug')('backend:main');
const { Proxy } = require('./proxy');

var ServiceDeskApi = /** @class */ (function () {
    
    function Backend(jiraUri) {
        this.proxy = new Proxy(jiraUri);
    }

    Backend.prototype.auth = function(loginData, callback) {
        this.proxy.post('/jira/rest/auth/1/session', loginData, (response, data) => {
            if (response.statusCode != 200) {
                const errorMessages = data['errorMessages'];
                callback({success: false, messages: errorMessages});
            } else {
                const setCookie = response.headers['set-cookie'] + '' || '';
                const setCookieArray = setCookie.split(',');    // Set-Cookie multiple values must be in form of an array
                data.setCookie = setCookieArray;
                callback({success: true, messages: data});
            }
        })
    }

    Backend.prototype.isAuth = function(callback) {
        this.proxy.get('/jira/rest/auth/1/session', (response, data) => {
            if (response.statusCode != 200) {
                const errorMessages = data['errorMessages'];
                callback({success: false, messages: errorMessages});
            } else {
                callback({success: true, messages: data});
            }
        })
    }

    return Backend;
}());

exports.ServiceDeskApi = ServiceDeskApi;