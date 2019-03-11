import { IncomingMessage } from 'http';

export class Proxy {
    /** Stores Authentication token from login response */
    token: string;
    
    /**
     * @param baseUri Service Desk server origin URI ex: https://jira.mydomain.com
     */
    constructor(baseUri: string)

    get(path: string, callback: (response: IncomingMessage, data: any) => void): void;

    post(path: string, data: any, callback: (response: IncomingMessage, data: any) => void): void;
}