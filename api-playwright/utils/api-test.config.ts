import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });// Load environment variables from .env file

const processEnv = process.env.TEST_ENV; // Get the environment variable
export const env = (processEnv || "qa") as keyof typeof config; // Default to 'dev' if TestEnv is not set
console.log(`Test environment: ${env}`);

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const config = {
  qa: {
    apiUrl: "https://conduit-api.bondaracademy.com/api/",
    userEmail: requireEnv("QA_EMAIL"),
    userPassword: requireEnv("QA_PASSWORD"),
  },
  staging: {
    apiUrl: "https://conduit-api.bondaracademy.com/api/",
    userEmail:requireEnv("STAGING_EMAIL"),
    userPassword: requireEnv("STAGING_PASSWORD"),
  },
  dev: {
    apiUrl: "https://conduit-api.bondaracademy.com/api/",
    userEmail: requireEnv("DEV_EMAIL"),
    userPassword: requireEnv("DEV_PASSWORD"),
  },
  prod: {
        apiUrl: "https://api.realworld.show/api/",
        userEmail : requireEnv("PROD_EMAIL"),
        userPassword : requireEnv("PROD_PASSWORD"),
  },
};

// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// const requestedEnv = process.env.TEST_ENV || 'qa';

// const supportedEnvironments = ['qa', 'staging', 'dev', 'prod'] as const;

// if (!supportedEnvironments.includes(requestedEnv as typeof supportedEnvironments[number])) {
//   throw new Error(`Invalid TEST_ENV: ${requestedEnv}`);
// }

// export const env = requestedEnv as typeof supportedEnvironments[number];

// function requireEnv(name: string): string {
//   const value = process.env[name];

//   if (!value) {
//     throw new Error(`Missing environment variable: ${name}`);
//   }

//   return value;
// }

// export const config = {
//   qa: {
//     apiUrl: 'https://conduit-api.bondaracademy.com/api/',
//     get userEmail() {
//       return requireEnv('QA_EMAIL');
//     },
//     get userPassword() {
//       return requireEnv('QA_PASSWORD');
//     },
//   },
//   staging: {
//     apiUrl: 'https://conduit-api.bondaracademy.com/api/',
//     get userEmail() {
//       return requireEnv('STAGING_EMAIL');
//     },
//     get userPassword() {
//       return requireEnv('STAGING_PASSWORD');
//     },
//   },
//   dev: {
//     apiUrl: 'https://conduit-api.bondaracademy.com/api/',
//     get userEmail() {
//       return requireEnv('DEV_EMAIL');
//     },
//     get userPassword() {
//       return requireEnv('DEV_PASSWORD');
//     },
//   },
//   prod: {
//     apiUrl: 'https://api.realworld.show/api/',
//     get userEmail() {
//       return requireEnv('PROD_EMAIL');
//     },
//     get userPassword() {
//       return requireEnv('PROD_PASSWORD');
//     },
//   },
// };
