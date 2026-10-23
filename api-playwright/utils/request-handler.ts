import { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";
import { APILogger } from "./loggers";

export class RequestHandler {
  private request: APIRequestContext;
  private baseUrl: string = "";
  private defaultUrl: string;
  private apiPath: string = "";
  private queryParams: object = {};
  private apiHeaders: Record<string, string> = {};
  private apiBody: object = {};
  private logger: APILogger;
  private defaultToken: string;
  private clearAuthFlag: boolean = false;
  constructor(
    request: APIRequestContext,
    apibaseUrl: string,
    logger: APILogger,
    Token: string = ""
  ) {
    this.request = request;
    this.defaultUrl = apibaseUrl; //fixture ebaseUrl is used here as diff var name called defaulturl
    this.logger = logger;
    this.defaultToken = Token;
  }
  url(url: string) {
    this.baseUrl = url;
    return this;
  }
  path(path: string) {
    this.apiPath = path;
    return this;
  }
  params(params: object) {
    this.queryParams = params;
    return this;
  }
  headers(headers: Record<string, string>) {
    this.apiHeaders = headers;
    return this;
  }
  body(body: object) {
    this.apiBody = body;
    return this;
  }

  clearAuth(){ //w/o parameter, this method will clear the default token from the request headers for the next request. This is useful when you want to make a request without authentication.
    this.clearAuthFlag = true;
    return this
  }

  async getRequest(statuscode: number) {
    const url = this.getUrl();
    this.logger.logRequest("GET", url, this.getHeaders()); //type=Get (just text),logRequest function is come from logger.ts file 
    const response = await this.request.get(url, {
      headers: this.getHeaders(), //sending object as parameters, so extra bracket
    });
    this.clearfields(); // Clear request fields data after request is made to avoid data leakage between tests
    const responseJson = await response.json();
    const actualstatuscode = response.status();
    const actualheaders = response.headers();
    this.logger.logResponse(actualstatuscode, actualheaders, responseJson); //logResponse function is come from logger.ts file
    this.statusCodevalidater(actualstatuscode, statuscode, this.getRequest);

    expect(response.status()).toEqual(statuscode);

    return responseJson;
  }
  async postRequest(statuscode: number) {
    const url = this.getUrl();
    this.logger.logRequest("POST", url, this.getHeaders(), this.apiBody);
    const response = await this.request.post(url, {
      headers: this.getHeaders(),
      data: this.apiBody,
    });
    this.clearfields(); 
    const responseJson = await response.json();
    const actualstatuscode = response.status();
    const actualheaders = response.headers();
    this.logger.logResponse(actualstatuscode, actualheaders, responseJson);
    //console.log(this.logger.getRecentLogs());

    this.statusCodevalidater(actualstatuscode, statuscode, this.postRequest);

    console.log(this.logger.getRecentLogs()); //log the recent logs after validation to see the logs even if validation fails
    expect(response.status()).toEqual(statuscode);
    return responseJson;
  }

  async putRequest(statuscode: number) {
    const url = this.getUrl();
    this.logger.logRequest("PUT", url, this.getHeaders(), this.apiBody);
    const response = await this.request.put(url, {
      headers: this.getHeaders(),
      data: this.apiBody,
    });
    const responseJson = await response.json();
    const actualstatuscode = response.status();
    const actualheaders = response.headers();
    this.logger.logResponse(actualstatuscode, actualheaders, responseJson);
    this.clearfields(); // Clear fields after request is made
    this.statusCodevalidater(actualstatuscode, statuscode, this.putRequest);

    expect(response.status()).toEqual(statuscode);
    return responseJson;
  }

  async deleteRequest(statuscode: number) {
    const url = this.getUrl();
    this.logger.logRequest("DELETE", url, this.getHeaders());
    const response = await this.request.delete(url, {
      headers: this.getHeaders(),
    });
    const actualstatuscode = response.status();
    const actualheaders = response.headers();
    this.logger.logResponse(actualstatuscode, actualheaders);
    this.statusCodevalidater(actualstatuscode, statuscode, this.deleteRequest);

    this.clearfields(); // Clear fields after request is made
    expect(response.status()).toEqual(statuscode);
  }
  private getUrl() {
    const url = new URL(`${this.baseUrl || this.defaultUrl}${this.apiPath}`); //baseurl here is "" empty string, so it use only default url which is ebaseurl(in contructor, it changes as defaulturl) from fixtures
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value);
    }
    return url.toString();
  }

  private statusCodevalidater(
    actualStatusCode: number,
    expectedStatusCode: number,
    callingMethod: Function,
  ) {
    {
      if (actualStatusCode !== expectedStatusCode) {
        const logs = this.logger.getRecentLogs();
        const errormessage = new Error(
          `Expected status code ${expectedStatusCode} but got ${actualStatusCode}\n\n Recent API logs: \n${logs}\n\n`,
        ); //throw error with logs
        Error.captureStackTrace(errormessage, this.statusCodevalidater); //capture stack trace and console log the error message with logs
        throw errormessage;
      }
    }
  }

  private getHeaders() {
  if (!this.clearAuthFlag && this.defaultToken) {
    this.apiHeaders['Authorization'] =
      this.apiHeaders['Authorization'] || this.defaultToken;
  }

  return this.apiHeaders;
}
    private clearfields(){
    this.baseUrl = "";
    this.apiPath = "";
    this.queryParams = {};
    this.apiHeaders = {};
    this.apiBody = {};
    this.clearAuthFlag = false; //reset clearAuthFlag after each request
    }
  }

