import fs from "fs/promises";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";


const SCHEMA_BASE_PATH = "./response-schemas"; 
const ajv = new Ajv();
addFormats(ajv)


export async function validateSchema(
  dirName: string, //tags - kindly folder name of schema.json file
  fileName: string,
  responseBody: any,
) {
  const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, fileName);
  const schema = await loadSchema(schemaPath);
  const validate = ajv.compile(schema);

  const valid = validate(responseBody);
  if (!valid) {
    throw new Error(
      `Schema validation failed for ${fileName}_schema.json:\n` +
      `${JSON.stringify(validate.errors, null, 4)}\n\n` +
      `Response Body:\n` +
      `${JSON.stringify(responseBody, null, 4)}`,
    );
  }
}

export async function loadSchema(schemaPath: string) {
  try {
    const schemaContent = await fs.readFile(schemaPath, "utf-8"); // Read the schema file
    return JSON.parse(schemaContent);
  } catch (error) {
    throw new Error(`Failed to read schema from ${schemaPath}: ${error}`);
  }
}
