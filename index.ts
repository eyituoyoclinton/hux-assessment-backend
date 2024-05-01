import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Router from "./router";
import { userModel } from "./src/models/users";

const app = express();

// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Setup body parser
app.use(express.json());

// Setup CORS - Accessible by other domains
app.use(cors());

app.use("/api/", Router);
// app.use("/api/v1/profile", profileRoute);

// Handle unhandled routes
app.all("*", (req, res, next) => {
  return res.status(404).json({
    message: "Requested resource does not exist",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
