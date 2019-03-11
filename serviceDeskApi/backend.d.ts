export class ServiceDeskApi {
    /**
     * @param jiraUri Jira Server base url ex: https://jira.mydomain.com
     */
    constructor(jiraUri: string)

    auth(login: {username: string, password: string}, callback: (result: {success: boolean, message: void}) => void): void;

    isAuth(callback: (result: {success: boolean, message: any}) => void): void;
}