import mongoose from "mongoose";
import { fileConfig } from "../utils/file-config";

//create the connections
const dbConn = mongoose.createConnection(fileConfig.config.dbUrl);

//adding error listening
dbConn.on("error", () => {
  console.log("App database error occurred at " + new Date());
});

//adding connection listening
dbConn.on("open", () => {
  console.log("App database Connected at " + new Date());
});

export { dbConn, mongoose };
