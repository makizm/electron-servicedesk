"use strict";
const debug = require('debug')('backend:main');
const { Proxy } = require('./proxy');

var ServiceDeskApi = /** @class */ (function () {
    
    function Backend(jiraUri) {
        this.proxy = new Proxy(jiraUri);
    }

    /** Process http response */
    function response(callback) {
        return function(response, data) {
            if (response.statusCode !== 200) {
                const errorMessages = data['errorMessages'];
                callback({success: false, statusCode: response.statusCode, messages: errorMessages});
            } else {
                callback({success: true, statusCode: response.statusCode, messages: data});
            }
        }
    }

    Backend.prototype.auth = function(authData, callback) {
        this.proxy.post('/jira/rest/auth/1/session', authData, (response, data) => {
            if (response.statusCode !== 200) {
                const errorMessages = data['errorMessages'];
                callback({success: false, messages: errorMessages});
            } else {
                const setCookie = response.headers['set-cookie'] + '' || '';
                const setCookieArray = setCookie.split(',');
                let authString = '';
                setCookieArray.forEach((value, id) => {
                    // grab only 'key=value' part
                    // the rest are cookie options such as 'path' and 'HttpOnly'
                    const cookie = value.split(';');
                    authString = authString + cookie[0];
                    
                    // values must be delimited by semicolon
                    if (id !== setCookieArray.length - 1) {
                        authString = authString + '; ';
                    }
                })
                data.setCookie = setCookie;
                data.auth = authString;
                callback({success: true, setCookie: setCookieArray, responseData: { auth: authString }, messages: data});
            }
        })
    }

    Backend.prototype.isAuth = function(authData, callback) {
        this.proxy.get('/jira/rest/auth/1/session', authData, (response, data) => {
            if (response.statusCode !== 200) {
                const errorMessages = data['errorMessages'];
                callback({success: false, messages: errorMessages});
            } else {
                callback({success: true, messages: data});
            }
        })
    }

    Backend.prototype.info = function(authData, callback) {
        this.proxy.get('/jira/rest/servicedeskapi/info', authData, response(callback));
    }

    Backend.prototype.servicedesk = function(authData, callback) {
        this.proxy.get('/jira/rest/servicedeskapi/servicedesk', authData, response(callback));
    }

    Backend.prototype.organizations = function(authData, callback) {
        this.proxy.get('/jira/rest/servicedeskapi/organization', authData, response(callback));
    }

    Backend.prototype.getRequests = function(authData, callback) {
        this.proxy.get('/jira/rest/servicedeskapi/request', authData, response(callback));
    }

    Backend.prototype.getRequest = function(authData, id, callback) {
        this.proxy.get(`/jira/rest/servicedeskapi/request/${id}`, authData, response(callback));
    }

    Backend.prototype.getRequestStatus = function(authData, id, callback) {
        this.proxy.get(`/jira/rest/servicedeskapi/request/${id}/status`, authData, response(callback));
    }

    Backend.prototype.getRequestComments = function(authData, id, callback) {
        this.proxy.get(`/jira/rest/servicedeskapi/request/${id}/comment`, authData, response(callback));
    }

    Backend.prototype.addRequestComment = function(authData, id, commentData, callback) {
        this.proxy.post(`/jira/rest/servicedeskapi/request/${id}/comment`, commentData, authData, response(callback));
    }

    Backend.prototype.createRequest = function(authData, requestData, callback) {
        this.proxy.post(`/jira/rest/servicedeskapi/request`, requestData, authData, response(callback));
    }

    return Backend;
}());

exports.ServiceDeskApi = ServiceDeskApi;