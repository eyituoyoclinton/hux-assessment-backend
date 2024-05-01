import express from "express";
export interface AuthInterface {
  req: express.Request;
  res: express.Response;
  params: Array<string>;
}
export interface UserDataType {
  firstname: string;
  lastname: string;
  user_id: string;
  email: string;
}

export interface PrivateMethodProps {
  req: express.Request;
  res: express.Response;
  userData: UserDataType;
  id?: string;
}
