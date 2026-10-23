import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });// Load environment variables from .env file


const processEnv = process.env.TEST_ENV || "qa";
export const env = processEnv as keyof typeof config;

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
    get userEmail() { return requireEnv("QA_EMAIL"); },
    get userPassword() { return requireEnv("QA_PASSWORD"); },
  },
  staging: {
    apiUrl: "https://conduit-api.bondaracademy.com/api/",
    get userEmail() { return requireEnv("STAGING_EMAIL"); },
    get userPassword() { return requireEnv("STAGING_PASSWORD"); },
  },
  dev: {
    apiUrl: "https://conduit-api.bondaracademy.com/api/",
    get userEmail() { return requireEnv("DEV_EMAIL"); },
    get userPassword() { return requireEnv("DEV_PASSWORD"); },
  },
  prod: {
    apiUrl: "https://api.realworld.show/api/",
    get userEmail() { return requireEnv("PROD_EMAIL"); },
    get userPassword() { return requireEnv("PROD_PASSWORD"); },
  },
};




