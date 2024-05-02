import express from "express";
import helpers from "../utils/helpers";
import { userModel } from "../models/users";
import { fileConfig } from "../utils/file-config";
import { UserDataType } from "../types/Types";
import JWT from "jsonwebtoken";

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
  async profile() {
    if (this.method !== "get") {
      return helpers.outputError(this.res, 405);
    }

    let checkUser: any = await userModel
      .findOne({ _id: this.userData.user_id }, null, {
        lean: true,
      })
      .catch((e) => ({ error: e }));
    //check if there is query error
    if (checkUser && checkUser.error) {
      return helpers.outputError(this.res, 500);
    }
    if (!checkUser) {
      return helpers.outputError(this.res, null, "Account not found");
    }

    //preparing the payload
    let JWTData: UserDataType = {
      firstname: checkUser.firstname,
      lastname: checkUser.lastname,
      email: checkUser.email,
      user_id: checkUser._id,
    };
    //   signing the jwt
    let signinToken = JWT.sign(JWTData, fileConfig.config.jwtSecret, {
      expiresIn: "24hr",
    });
    checkUser.user_id = checkUser._id;
    checkUser.token = signinToken;
    delete checkUser.password;
    delete checkUser.__v;
    delete checkUser._id;

    return helpers.outputSuccess(this.res, checkUser);
  }
}
