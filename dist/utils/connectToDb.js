import mongoose from "mongoose";
import log from "./logger.js";
import User from "../model/authModel.js";
async function connectToDB() {
    const dbUri = process.env.NEXT_DB_URI || "mongodb://localhost:27017/otpvarification";
    try {
        await mongoose.connect(dbUri);
        log.info("Connected to DB");
        await User.createCollection();
        log.info("User collection created");
    }
    catch (err) {
        log.error(`Error connecting to DB ${err}`);
        process.exit(1);
    }
}
// connectToDB();
export default connectToDB;
