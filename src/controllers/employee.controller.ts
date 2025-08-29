import { type Request, type Response } from "express";
import Employee from "../model/employeeMOdal.js";

// get all employee
export async function getAllEmployee(req:Request, res: Response){
    try{
        const employees= await Employee.find({});
        return res.status(200).json({
            message:"All Employees",
            data:employees,
        })
    }catch(err){
        return res.status(500).json({
            message:"Error while fetching all employee",
            error:err,
        })
    }
}

// get employee by id
export async function getEmployeeById(req:Request, res: Response){
    try{
        const {id}= req.params;
        const employees= await Employee.find({_id:id});
        if(!employees) {
            return res.status(404).json({
                message:`No employee found with this ${id}`
        })}
        return res.status(200).json({
            message:"All Employees",
            data:employees,
        })
    }catch(err){
        return res.status(500).json({
            message:"Error while fetching all employee",
            error:err,
        })
    }
}


// create new employee
export async function createNewEmployee(req:Request, res: Response){
    try{
        const {name,email,password,phone,dob} =req.body;
        const employeeExist=await Employee.findOne({email})
        if(employeeExist){
            return res.status(409).json({
                message:"Email already exist"
            })
        }
        const employee=new Employee({name,email,password,phone,dob});
        await employee.save();
        return res.status(201).json({
            message:"Employee created successfully",
            data:employee,
        })
        }catch(err){
            console.log("error", err);
            return res.status(500).json({
                message:"Error while creating a new employee",
                error:err,
        })
    }
}


// update employee
export async function updateEmployee(req:Request, res: Response){
    try{
        const {id}= req.params;
        const employee=await Employee.findByIdAndUpdate({_id:id},{$set:req.body},{new:true});
        if(employee){
            return res.status(200).json({
                message:"Employee updated successfully",
                data:employee,
            })
        }
        return res.status(404).json({
            message:`No employee found with this ${id}`
        });
    }catch(err){
        return res.status(500).json({
            message:"Error while updating the employee",
            error:err,
        })
    }   
}

// delete employee
export async function deleteEmployee(req:Request, res: Response){
    try{
        const {id}= req.params;
        const employee=await Employee.findByIdAndDelete({_id:id});
        if(employee){
            return res.status(200).json({
                message:"Employee deleted successfully",
                data:employee,
            })
        }
        return res.status(404).json({
            message:`No employee found with this ${id}`
        });
    }catch(err){
        return res.status(500).json({
            message:"Error while deleting the employee",
            error:err,
        })
    }
}