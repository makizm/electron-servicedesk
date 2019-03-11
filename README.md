# Introduction

Experimental electron app for Atlassian Service Desk

Based on boilerplate https://github.com/maximegris/angular-electron

## Getting Started

Clone this repository locally then run dependencies with npm :

``` bash
npm install
```

#### Start Electron app in Windows using Powershell
```
$env:JIRA_URI='https://jira.mydomain.com'; npm run start
```

#### Start Electron app on MAC
```
JIRA_URI='https://jira.mydomain.com' npm run start
```

#### Start Web App on MAC
```
JIRA_URI='https://jira.mydomain.com' node .\serviceDeskApi\web-backend.js && npm run ng:serve:web
```