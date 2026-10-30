import dbConnect from "@//lib/dbConnect";
import UserModel from "@//app/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@//helpers/sendEmailverification";

export async function POST(request:Request) {

    await dbConnect()

    try {
        const {username,email,password} =await  request.json()

        
    } catch (error) {
        console.log("Error registering user",error)
        return Response.json(
            {
                success:false,
                message:"Error regestering"
            },
        {
            status:500
        }        )
    }
    
}