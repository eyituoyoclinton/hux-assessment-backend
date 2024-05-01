import express from "express";
import helpers from "../utils/helpers";
import validator from "validator";
import { userModel } from "../models/users";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { fileConfig } from "../utils/file-config";
import { UserDataType } from "../types/Types";

export default class auths {
  req: express.Request;
  res: express.Response;
  method: string;
  constructor(req: express.Request, res: express.Response) {
    this.req = req;
    this.res = res;
    this.method = req.method.toLowerCase();
  }

  async createAccount() {
    if (this.method !== "post") {
      return helpers.outputError(this.res, 405);
    }
    let firstname: string = this.req.body.firstname;
    let lastname: string = this.req.body.lastname;
    let email: string = this.req.body.email;
    let mobile: string = this.req.body.mobile;
    let password: string = this.req.body.password;

    //if the firstname is not valid xter
    if (!firstname || !lastname) {
      return helpers.outputError(
        this.res,
        null,
        !firstname ? "firstname is required" : "lastname is required"
      );
    }
    if (firstname.length < 2 || lastname.length < 2) {
      return helpers.outputError(
        this.res,
        null,
        firstname.length < 2
          ? "firstname is too short"
          : "lastname is too short"
      );
    }
    if (!/^[a-z\-]+$/i.test(firstname)) {
      return helpers.outputError(
        this.res,
        null,
        "Special character is not allowed in the firstname"
      );
    }
    //if the lastname is not valid xter
    if (!/^[a-z\-]+$/i.test(lastname)) {
      return helpers.outputError(
        this.res,
        null,
        "Special character is not allowed in the lastname"
      );
    }
    if (!email) {
      return helpers.outputError(this.res, null, "email is required");
    }
    if (!validator.isEmail(email)) {
      return helpers.outputError(this.res, null, "Invalid email submited");
    }
    if (!mobile) {
      return helpers.outputError(this.res, null, "mobile is required");
    }
    if (!validator.isNumeric(mobile)) {
      return helpers.outputError(this.res, null, "mobile is invalid");
    }
    if (mobile.length < 10 || mobile.length > 13) {
      return helpers.outputError(this.res, null, "mobile is invalid");
    }
    if (!password) {
      return helpers.outputError(this.res, null, "password is required");
    }
    if (password.length < 6) {
      return helpers.outputError(
        this.res,
        null,
        "password length should be greater than 6"
      );
    }

    //check if email or mobile exist before
    let checkUser: any = await userModel
      .findOne({ $or: [{ email }, { mobile }] }, null, { lean: true })
      .catch((e) => ({ error: e }));
    //check if there is query error
    if (checkUser && checkUser.error) {
      return helpers.outputError(this.res, 500);
    }
    //check if email or mobile number exist already
    if (checkUser) {
      if (checkUser.mobile === mobile) {
        return helpers.outputError(
          this.res,
          null,
          "Mobile number already exist"
        );
      }
      if (checkUser.email === email) {
        return helpers.outputError(this.res, null, "Email already exist");
      }
    }

    //hash password
    let passwordHash = bcrypt.hashSync(password, 10);
    let createUser: any = await userModel
      .create({
        firstname,
        lastname,
        email,
        mobile,
        password: passwordHash,
      })
      .catch((e) => ({ error: e }));
    //check for query error
    if (createUser && createUser.error) {
      console.log(createUser.error);
      return helpers.outputError(this.res, 500);
    }
    if (!createUser) {
      return helpers.outputError(
        this.res,
        null,
        "Sorry we cannot create this account at this moment"
      );
    }

    createUser = createUser.toObject();
    let JWTData: UserDataType = {
      firstname: createUser.firstname,
      lastname: createUser.lastname,
      email: createUser.email,
      user_id: createUser._id,
    };
    let signinToken = JWT.sign(JWTData, fileConfig.config.jwtSecret, {
      expiresIn: "24hr",
    });
    createUser.user_id = createUser._id;
    createUser.token = signinToken;
    delete createUser.password;
    delete createUser.__v;
    delete createUser._id;

    return helpers.outputSuccess(this.res, createUser);
  }

  async login() {
    if (this.method !== "post") {
      return helpers.outputError(this.res, 405);
    }
    let username: string = this.req.body.username;
    let password: string = this.req.body.password;
    let isEmail: boolean = false;
    if (!username) {
      return helpers.outputError(this.res, null, "email/mobile is required");
    }

    if (validator.isNumeric(username)) {
      if (username.length < 10 || username.length > 13) {
        return helpers.outputError(this.res, null, "mobile is invalid");
      }
    } else {
      if (!validator.isEmail(username)) {
        return helpers.outputError(this.res, null, "email is invalid");
      }
      isEmail = true;
    }
    if (!password || password.length < 6) {
      return helpers.outputError(this.res, null, "password is invalid");
    }
    //check if email or mobile exist before
    let checkUser: any = await userModel
      .findOne(isEmail ? { email: username } : { mobile: username }, null, {
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
    if (!bcrypt.compareSync(password, checkUser.password)) {
      return helpers.outputError(this.res, null, "Invalid account details");
    }

    let JWTData: UserDataType = {
      firstname: checkUser.firstname,
      lastname: checkUser.lastname,
      email: checkUser.email,
      user_id: checkUser._id,
    };
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
