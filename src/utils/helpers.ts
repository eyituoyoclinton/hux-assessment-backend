import express from "express";
import validator from "validator";
export default class helpers {
  // for checking input fields
  static getInputValueString(inputObj: object | any, field: string): string {
    return inputObj instanceof Object &&
      inputObj.hasOwnProperty(field) &&
      typeof inputObj[field] === "string"
      ? inputObj[field].trim()
      : "";
  }

  //success response function
  static outputSuccess(res: express.Response, data?: any): void {
    res.json({ status: "ok", data });
  }

  //error response function
  static outputError(
    res: express.Response,
    code: number | null,
    message?: string
  ): void {
    res.statusCode = code || 422;
    let outputObj = {};
    switch (code) {
      case 400:
        outputObj = {
          message: message || "Bad Request",
        };
        break;
      case 401:
        outputObj = {
          message: message || "Unauthorized",
        };
        break;
      case 404:
        outputObj = {
          message: message || "Requested resources does not exist",
        };
        break;
      case 405:
        outputObj = {
          message: message || "Method Not Allowed",
        };
        break;
      case 406:
        outputObj = {
          message: message || "Requested Not Acceptable",
        };
        break;
      case 500:
        outputObj = {
          message: message || "Oops! Something went wrong.",
        };
        break;
      case 503:
        outputObj = {
          message: message || "Service Unavailable",
        };
        break;
      default:
        outputObj = {
          message: message,
        };
    }
    res.json({ status: "error", code, ...outputObj });
  }

  //if there's no valid ID
  static isInvalidID(ID: string) {
    return !ID ? true : !validator.isMongoId(ID);
  }
}
