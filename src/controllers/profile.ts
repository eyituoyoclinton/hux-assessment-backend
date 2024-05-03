import express from "express";
import helpers from "../utils/helpers";
import { userModel } from "../models/users";
import { fileConfig } from "../utils/file-config";
import { UserDataType } from "../types/Types";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { mongoose } from "../models/db-connector";

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
  //this API is use to refresh the UI design
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
  //this is a service to allow a user reset his/her password
  async resetPassword() {
    if (this.method !== "patch") {
      return helpers.outputError(this.res, 405);
    }
    let oldPassword: string = this.req.body.oldPassword;
    let password: string = this.req.body.password;

    if (!oldPassword || oldPassword.length < 6) {
      return helpers.outputError(this.res, null, "Old password is not valid");
    }

    if (!password || password.length < 6) {
      return helpers.outputError(
        this.res,
        null,
        "password length should be greater than 6"
      );
    }
    //build our database query
    let queryBuilder: Record<string, any> = {
      _id: new mongoose.Types.ObjectId(this.userData.user_id),
    };
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

    //comparing the old password submitted with what we have in the database
    if (!bcrypt.compareSync(oldPassword, checkUser.password)) {
      return helpers.outputError(this.res, null, "Invalid password");
    }

    //hash password
    let passwordHash = bcrypt.hashSync(password, 10);
    //add the password to the query builder
    queryBuilder.password = passwordHash;
    //update the user table with the new password
    let updatePassword: any = await userModel
      .findByIdAndUpdate(this.userData.user_id, queryBuilder, {
        new: true,
        lean: true,
      })
      .catch((e) => ({ error: e }));
    //check for query error
    if (updatePassword && updatePassword.error) {
      console.log(updatePassword.error);
      return helpers.outputError(this.res, 500);
    }
    //check it the Password was updated
    if (!updatePassword) {
      return helpers.outputError(
        this.res,
        null,
        "Sorry we cannot update this Password at this moment"
      );
    }

    return helpers.outputSuccess(this.res, "Password reset was successful");
  }
}
