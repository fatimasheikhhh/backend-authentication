import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type: String     // otp for verification    
    },
    otpExpiry: {
        type: Date,   // expiry time of the otp 
    },
    isVarified:{
        type:Boolean,
        default:false // email varification status 
    }
});

const User= mongoose.model("User",UserSchema);

export default User;