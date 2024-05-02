import { dbConn, mongoose } from "./db-connector";
const Schema = mongoose.Schema;

const contact = new Schema(
  {
    id: Schema.Types.ObjectId,
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },
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
    mobile: {
      type: String,
      required: true,
      maxLength: 13,
    },
  },
  {
    timestamps: true,
    minimize: false,
    id: true,
  }
);

const contactModel = dbConn.model("contact", contact);
export { contactModel };
