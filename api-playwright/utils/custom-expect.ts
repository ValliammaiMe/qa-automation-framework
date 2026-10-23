import { expect as baseExpect } from "@playwright/test";
import { APILogger } from "./loggers";
import { validateSchema } from "./schema-validator";
import { match } from "node:assert";

let apiLogger: APILogger; //APILogger is instance type

export const setCustomExpectLogger = (logger: APILogger) => {
  apiLogger = logger;
};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      customEqual(expected: T): R;
      shouldMatchSchema(dirName: string, fileName: string):Promise<R>;

      customToBeLessThanOrEqual(expected: number): R;
    }
  }
}

export const expect = baseExpect.extend({
 async shouldMatchSchema(received: any, dirName: string,
  fileName: string) {
    let pass: boolean;
    let message: string = "";

    try {
  await validateSchema(dirName, fileName, received);
      pass = true;
      message = `Schema validation passed for ${fileName}_schema.json`;

      // if (this.isNot) {
      //   logs = apiLogger?.getRecentLogs?.() || "";
      //}
    } catch (e: any) {
      pass = false;
      const logs = apiLogger?.getRecentLogs?.() || ""; //getRecentLogs comes from logger.ts file, it will return the recent logs as a string, if no logs available, it will return empty string
      message = `${e.message}\n\nRecent API Activity:\n${logs}`;
    }

    // const hint = this.isNot ? "not " : "";

    // const message =
    //   this.utils.matcherHint("customEqual", undefined, undefined, {
    //     isNot: this.isNot,
    //   }) +
    //   "\n\n" +
    //   `Expected: ${hint}${this.utils.printExpected(expected)}\n` +
    //   `Received: ${this.utils.printReceived(received)}\n\n` +
    //   `Recent API Activity:\n${logs}`;
 return {
      pass,
      message: () => message,
    };
  },


  customEqual(received: any, expected: any) {
    let pass: boolean;
    let logs: string = "";

    try {
      baseExpect(received).toEqual(expected);// toequal is actual "expect" plawright assertion
      pass = true;

      if (this.isNot) {
        logs = apiLogger?.getRecentLogs?.() || "";
      }
    } catch (e) {
      pass = false;
      logs = apiLogger?.getRecentLogs?.() || "";
    }

    const hint = this.isNot ? "not " : "";//if-else, Its job is to build a readable text message. It doesn't perform the comparison; baseExpect(received).toEqual(expected) already does that.

    const message =
      this.utils.matcherHint("customEqual", undefined, undefined, {
        isNot: this.isNot,
      }) +
      "\n\n" +
      `Expected: ${hint}${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(received)}\n\n` +
      `Recent API Activity:\n${logs}`;

    return {
      pass,
      message: () => message,
    };
  },

  customToBeLessThanOrEqual(received: number, expected: number) {
    let pass: boolean;
    let logs: string = "";

    try {
      baseExpect(received).toBeLessThanOrEqual(expected); // toBeLessThanOrEqual is actual "expect" plawright assertion
      pass = true;

      if (this.isNot) {
        logs = apiLogger?.getRecentLogs?.() || "";
      }
    } catch (e) {
      pass = false;
      logs = apiLogger?.getRecentLogs?.() || "";
    }

    const hint = this.isNot ? "not " : "";

    const message =
      this.utils.matcherHint(
        "customToBeLessThanOrEqual",
        undefined,
        undefined,
        { isNot: this.isNot },
      ) +
      "\n\n" +
      `Expected: ${hint}${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(received)}\n\n` +
      `Recent API Activity:\n${logs}`;

    return {
      pass,
      message: () => message,
    };
  },
});
