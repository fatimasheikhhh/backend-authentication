import { createTransport } from "nodemailer";
import { IMail } from "../types/index.js";


console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);

const transporter= createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL as string,
        pass:process.env.EMAIL_PASSWORD as string,
    }
});


export async function sendMail({to,subject,text}:IMail){
    await transporter.sendMail({
        from:process.env.EMAIL as string,
        to,
        subject,
        text
    });
}

