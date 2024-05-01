import { fileConfig } from "../utils/file-config";
import JWT from "jsonwebtoken";
// Check if the user is authenticated or not
export const isAuthenticatedUser = (headerToken: string) => {
  //   console.log(headerToken);
  // RUN AUTHENTICATION
  // if there's no auth
  if (!headerToken) {
    return false;
  }
  if (!headerToken.match(/^Bearer /)) {
    return false;
  }
  //check the database here
  let token = headerToken.substring(7);
  //verify the token
  try {
    let checkers = JWT.verify(token, fileConfig.config.jwtSecret);
    return checkers;
  } catch (e) {
    return false;
  }
};
