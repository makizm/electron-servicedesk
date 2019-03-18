export interface AuthResponse {
    success: boolean;
    setCookie: string;
    responseData: { auth: string };
    messages: any;
}

export interface SdResponse {
    success: boolean;
    statusCode: number;
    messages: any;
}

export interface SdReuqestModel {
    serviceDeskId: string;
    requestTypeId: string;
    requestFieldValues: {
        summary: string;
        description: string;
    }
    requestParticipants: string[];
}

export class ServiceDeskApi {
    /**
     * @param jiraUri Jira Server base url ex: https://jira.mydomain.com
     */
    constructor(jiraUri: string)

    auth(login: {username: string, password: string}, callback: (result: AuthResponse) => void): void;

    isAuth(authData: string, callback: (result: SdResponse) => void): void;

    /** Service Desk info */
    info(authData: string, callback: (result: SdResponse) => void): void;

    /** Service Desk instance info */
    servicedesk(authData: string, callback: (result: SdResponse) => void): void;

    /** Returns a list of organizations the user is a member of */
    organizations(authData: string, callback: (result: SdResponse) => void): void;

    /** Creates a customer request in a service desk */
    createRequest(authData: string, requestData: any, callback: (result: SdResponse) => void): void;

    /** Returns all customer requests for the user that is executing the query */
    getRequests(authData: string, callback: (result: SdResponse) => void): void;

    /** Returns the customer request for a given request Id/key */
    getRequest(authData: string, id: string, callback: (result: SdResponse) => void): void;

    /** Returns the status transitions for a customer request for a given request Id/key */
    getRequestStatus(authData: string, id: string, callback: (result: SdResponse) => void): void;

    /** Returns all comments on a customer request, for a given request Id/key */
    getRequestComments(authData: string, id: string, callback: (result: SdResponse) => void): void;

    /** Creates a public or internal comment on an existing customer request.
      * The currently logged-in user will be the author of the comment */
    addRequestComment(authData: string, id: string, commentData: any, callback: (result: SdResponse) => void): void;
}