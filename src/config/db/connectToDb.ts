import { connect } from "mongoose";
import log from "../../utils/logger.js";

async function connectToDB(){
    const dbUri : string= process.env.NEXT_DB_URI as string;
    try{
        await connect(dbUri);
        log.info("Connected to DB");
    }catch(err){
       log.error(`Error connecting to DB ${err}`);
       process.exit(1);
    }
}

export default connectToDB;