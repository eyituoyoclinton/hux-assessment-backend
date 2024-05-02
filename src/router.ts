import express from "express";
import helpers from "./utils/helpers";
import { fileConfig } from "./utils/file-config";
import { isAuthenticatedUser } from "./middleware/auth-middleware";

export default (req: express.Request, res: express.Response) => {
  //sanitize the url
  let urlpath = req.url;
  let url = urlpath.replace(/^\/+|\/+$/gi, "");
  //split the url
  let endpointParts = url.split("/");
  if (endpointParts.length < 2) {
    return helpers.outputError(res, 404);
  }

  let controller: any = null;
  let controllerName = endpointParts[0];
  //check for authenticated route
  let userData: any = {};
  if (!fileConfig.no_auth_controller.includes(controllerName)) {
    userData = isAuthenticatedUser(req.headers.authorization as string);
    if (!userData || !userData.user_id) {
      return helpers.outputError(res, 401, "its here");
    }
  }

  try {
    controller = require("./controllers/" + controllerName).default;
  } catch (e) {
    //  console.log(e);
    return helpers.outputError(res, 404);
  }
  //initialize the class
  let classParent = new controller(req, res, userData);
  //convert the method name to the naming convention of the code
  let methodName: string = endpointParts[1].replace(/\-{1}\w{1}/g, (match) =>
    match.replace("-", "").toUpperCase()
  );
  //get all params if available
  let params: Array<string> = endpointParts.slice(2) || [];
  //execute the methods if it exist
  if (typeof classParent[methodName] === "function") {
    //if the function does not expect params but the request has params
    if (params.length > 0 && classParent[methodName].length === 0) {
      return helpers.outputError(res, 404);
    }
    try {
      return classParent[methodName](...params).catch((e: any) => {
        console.log(e);

        return helpers.outputError(res, 503);
      });
    } catch (e) {
      console.log(e);
      return helpers.outputError(res, 503);
    }
  } else {
    return helpers.outputError(res, 404);
  }
};
