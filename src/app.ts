import express, { type Application } from "express";
import router from "./routes/index.js";
import cors, { CorsOptions } from "cors";
import connectToDB from "./config/db/connectToDb.js";

const app: Application = express();

connectToDB();

const corsOptions: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/v1", router);

export default app;
