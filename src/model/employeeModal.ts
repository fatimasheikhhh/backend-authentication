import mongoose from "mongoose";

const EmployeeSchema= new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        require: true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    dob:{
        type: String,
        require:true
    }

},
{
    timestamps:true,
}
);

const Employee= mongoose.model("Employee",EmployeeSchema);
export default Employee;