export class APILogger {
  private recentLogs: any[] = []; //using array because multiple log entries req and res available under 1 test

  logRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: object,
  ) {
    const logEntry = { //actually stores the log data and push in to recentlogs array
      method, //shorthand property instead of method: method, if key and value are same, we can use shorthand property
      url,
      headers,
      body,
      timestamp: new Date().toISOString(), //not shorthand property, because key and value are different, so we need to use full property
    };
    this.recentLogs.push({ type: "request", data: logEntry }); //type and data is to print and having the data which get from reqesthandler.ts file
  }

  logResponse(
    statusCode: number,
    headers: Record<string, string>,
    body?: object,
  ) {
    const logEntry = {
      statusCode,
      headers,
      body,
      timestamp: new Date().toISOString(),
    };
    this.recentLogs.push({ type: "response", data: logEntry });
  }
  getRecentLogs() { //used to get the recent logs from the recentLogs array and return as a string, so that we can print in the console or save in a file
    const logs = this.recentLogs
      .map((log) => {
        return `===${log.type}===\n${JSON.stringify(log.data, null, 4)}`; // 4 is spaces for indentation, null is replacer, if we want to filter the data, we can use replacer, but here we don't want to filter, so we use null
      })
      .join("\n\n");
    return logs;
  }
}
