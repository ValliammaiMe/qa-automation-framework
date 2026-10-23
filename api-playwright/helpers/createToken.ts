import { RequestHandler } from "../utils/request-handler";

export async function createToken(
  api: RequestHandler, // Pass the RequestHandler instance
  email: string,
  password: string,
): Promise<string> {
  try {
    const loginresponse = await api
      .path("users/login")
      .body({
        user: {
          email: email,
          password: password,
        },
      })
      .postRequest(200); //from request-handler.ts, postRequest method is called to make the POST request to the login endpoint and get the response. The expected status code is 200 for a successful login.
    const token = `Token ${loginresponse.user.token}`; //save token for future use
    return token;
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
}