import { dbConn, mongoose } from "./db-connector";
const Schema = mongoose.Schema;

const user = new Schema(
  {
    id: Schema.Types.ObjectId,
    firstname: {
      type: String,
      required: true,
      index: true,
      maxLength: 90,
    },
    lastname: {
      type: String,
      required: true,
      index: true,
      maxLength: 90,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 100,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      maxLength: 13,
    },
    password: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    minimize: false,
    id: true,
  }
);

const userModel = dbConn.model("users", user);
export { userModel };
