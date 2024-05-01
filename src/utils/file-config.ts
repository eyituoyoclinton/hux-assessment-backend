export const fileConfig = {
  cred: {
    local: {
      user: "",
      pass: "",
      host: "localhost",
      port: "27017",
      dbName: "hux_vc",
    },
    staging: {
      user: "increase_21",
      pass: "QRudhu0Fsw0b166S",
      host: "cluster0-mszft.mongodb.net",
      port: "27017",
      dbName: "hux_vc",
    },
    live: {
      user: "",
      pass: "",
      host: "",
      port: "",
      dbName: "",
    },
  },
  config: {
    env: "local",
    dbUrl: "",
    jwtSecret: "",
  },
  no_auth_controller: ["auths"],
};
fileConfig.config.env = "staging";
fileConfig.config.jwtSecret =
  "jakahs78sdadhqewsdhajha787ahahyuwehqhjskfsjs87s8diwh24jhjhdjdhad98djhdjd23jhdfjh7sdhjh2278";
// the database url to connect
fileConfig.config.dbUrl =
  fileConfig.config.env === "local"
    ? `mongodb://${fileConfig.cred.local.host}:${fileConfig.cred.local.port}/${fileConfig.cred.local.dbName}?retryWrites=true&w=majority`
    : fileConfig.config.env === "staging"
    ? `mongodb+srv://${fileConfig.cred.staging.user}:${fileConfig.cred.staging.pass}@${fileConfig.cred.staging.host}/${fileConfig.cred.staging.dbName}?authSource=admin&readPreference=primary&retryWrites=true&w=majority`
    : `mongodb://${fileConfig.cred.live.user}:${fileConfig.cred.live.pass}@${fileConfig.cred.live.host}:${fileConfig.cred.live.port}/${fileConfig.cred.live.dbName}?authSource=admin&readPreference=primary&retryWrites=true&w=majority`;
