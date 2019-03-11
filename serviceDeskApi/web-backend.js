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
const bodyParser = require('body-parser');

const server = require('http').createServer(app);

const proxy = require('express-http-proxy');

// Express Server common settings
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.route('/api').get((req, res) => {
    res.send({ message: "Welcome to Electron Service Desk backend API" });
})

app.get('/api/auth', (req, res) => {
    backend.isAuth((result) => {
        if(result.success === true) {
            res.writeHead(200, { 'Set-Cookie': result.messages.setCookie });
            res.end('OK');
        } else {
            res.status(401).send(result);
        }
    })
})

app.post('/api/auth', (req, res) => {
    const login = req.body;
    backend.auth(login, (result) => {
        if(result.success === true) {
            res.writeHead(200, { 'Set-Cookie': result.messages.setCookie });
            res.end('OK');
        } else {
            res.status(401).send(result);
        }
    })
})

app.use('/', proxy('localhost:' + UI_PORT));

server.listen(LISTEN_PORT, () => {
    console.log('Server started on port ' + LISTEN_PORT);
})
