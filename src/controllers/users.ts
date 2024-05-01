import express from "express";
import helpers from "../utils/helpers";
import validator from "validator";
import { contactModel } from "../models/contact";
import { fileConfig } from "../utils/file-config";
import { UserDataType } from "../types/Types";
import contactMethod from "../services/contacts-method";

export default class users {
  req: express.Request;
  res: express.Response;
  method: string;
  userData: UserDataType;
  constructor(
    req: express.Request,
    res: express.Response,
    userData: UserDataType
  ) {
    this.req = req;
    this.res = res;
    this.userData = userData;
    this.method = req.method.toLowerCase();
  }

  async contact(contactId?: string) {
    if (contactId && helpers.isInvalidID(contactId)) {
      return helpers.outputError(this.res, 404);
    }
    switch (this.method) {
      case "post":
        return contactMethod.createContact({
          req: this.req,
          res: this.res,
          userData: this.userData,
        });

      case "patch":
        if (!contactId) return helpers.outputError(this.res, 404);
        return contactMethod.updateContact({
          req: this.req,
          res: this.res,
          userData: this.userData,
          id: contactId,
        });
      case "get":
        return contactMethod.getContact({
          req: this.req,
          res: this.res,
          userData: this.userData,
          id: contactId,
        });
      case "delete":
        if (!contactId) return helpers.outputError(this.res, 404);
        return contactMethod.deleteContact({
          req: this.req,
          res: this.res,
          userData: this.userData,
          id: contactId,
        });

      default:
        return helpers.outputError(this.res, 405);
    }
  }
}
