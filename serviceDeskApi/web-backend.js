const LISTEN_PORT = 4000;
const UI_PORT = 4200;
const JIRA_URI = process.env.JIRA_URI;

if(!JIRA_URI) {
    throw new Error(`Must supply Jira server base URI as environmental variable 'JIRA_URI'`);
}

const debug = require('debug')('backend:web');

// Service Desk backend proxy
const { ServiceDeskApi } = require('./backend');
const backend = new ServiceDeskApi(JIRA_URI);

const express = require('express');
const app = express();

// Middleware JSON body parser for express
const bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser');

const server = require('http').createServer(app);

const proxy = require('express-http-proxy');

// Express Server common settings
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// custom authentication
// this is to work around 'set-cookie' authentication
app.use((req, res, next) => {
    debug('HEADERS', req.headers)
    const authData = req.headers['custom-jira-auth'] || '';
    req.authData = authData;
    next();
})

function SdBasicResponseHandler(res) {
    return function (result) {
        if(result.success === true) {
            res.send(result);
        } else {
            res.status(result.statusCode).send(result.messages);
        }
    }
}

// welcome handler
app.route('/api').get((req, res) => {
    res.send({ message: "Welcome to Electron Service Desk backend API" });
})

// handler to check if client is authenticated
app.get('/api/auth', (req, res) => {
    backend.isAuth(req.authData, (result) => {
        if(result.success === true) {
            // res.writeHead(200, { 'Set-Cookie': result.messages.setCookie });
            // res.end(JSON.stringify(result));
            res.send(result);
        } else {
            res.sendStatus(401);
        }
    })
})

// custom authentication handler
app.post('/api/auth', (req, res) => {
    const login = req.body;
    backend.auth(login, (result) => {
        if(result.success === true) {
            res.send(result.responseData);
        } else {
            // result.messages is type of Array here
            res.sendStatus(401);
        }
    })
})

// data handlers
app.get('/api/info', (req, res) => backend.info(req.authData, SdBasicResponseHandler(res)));
app.get('/api/servicedesk', (req, res) => backend.servicedesk(req.authData, SdBasicResponseHandler(res)));
app.get('/api/organizations', (req, res) => backend.organizations(req.authData, SdBasicResponseHandler(res)));
app.get('/api/requests', (req, res) => backend.getRequests(req.authData, SdBasicResponseHandler(res)));
app.post('/api/requests', (req, res) => backend.createRequest(req.authData, req.body, SdBasicResponseHandler(res)));
app.get('/api/request/:id', (req, res) => backend.getRequest(req.authData, req.params['id'], SdBasicResponseHandler(res)));
app.get('/api/request/:id/status', (req, res) => backend.getRequestStatus(req.authData, req.params['id'], SdBasicResponseHandler(res)));
app.get('/api/request/:id/comments', (req, res) => backend.getRequestComments(req.authData, req.params['id'], SdBasicResponseHandler(res)));
app.post('/api/request/:id/comments', (req, res) => backend.addRequestComment(req.authData, req.params['id'], req.body, SdBasicResponseHandler(res)));

// proxy everything to Angular frontent
app.use('/', proxy('localhost:' + UI_PORT));

server.listen(LISTEN_PORT, () => {
    console.log('Server started on port ' + LISTEN_PORT);
})
