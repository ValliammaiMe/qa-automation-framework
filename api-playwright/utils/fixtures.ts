import { test as base } from "@playwright/test";
import { RequestHandler } from "./request-handler";
import { APILogger } from "./loggers";
import { setCustomExpectLogger } from "./custom-expect";
import { config, env } from "./api-test.config";
import { createToken } from "../helpers/createToken";
export type TestFixtures = {
  api: RequestHandler; //key:value pair //provide the type of the value to be used in the test
};
export type WorkerFixtures = {
  Token: string
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  Token: [async ({ playwright }, use) => {
  const requestContext = await playwright.request.newContext();
  const logger = new APILogger();
  const api = new RequestHandler(
    requestContext,
    config[env].apiUrl,
    logger
  );

  const token = await createToken( //createtoken func is from createToken.ts file which is used to generate the token for the user
    api,
    config[env].userEmail,
    config[env].userPassword
  );
 
  await use(token);
  await requestContext.dispose();

}, { scope: 'worker' }],

  api: async ({ request, Token }, use) => {
    const logger = new APILogger();
    setCustomExpectLogger(logger);

    const requestHandler = new RequestHandler(
      request,
      config[env].apiUrl,
      logger,
      Token
    );

    await use(requestHandler);
  },

});