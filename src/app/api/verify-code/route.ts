import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import {z} from "zod"
import  {verifySchema} from '@/schemas/verifySchema'




export async function POST(request:Request) {
    try {
        await dbConnect();
        
        const body = await request.json()
        const parsed = verifySchema.safeParse(body)

        if(!parsed.success){
            return Response.json(
    {
        success: false,
        message: "Invalid request data",
        errors: parsed.error.flatten().fieldErrors,
    },
    { status: 400 }
);
}

        
   const { username, code } = parsed.data

    const decodedUsername =decodeURIComponent(username)
    
    const user = await UserModel.findOne({
        username:decodedUsername
    })
    if(!user){
         return Response.json(
            {success:false,
                message:"User not found"
            },{
                status:500
            }
        )
    }

    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry)>new Date()
    
    if(isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save()
         return Response.json(
            {success:true,
                message:"user is verified"
            },{
                status:200
            }
        )
    }
    else if(!isCodeNotExpired){
         return Response.json(
            {success:false,
                message:"Vefification code has expired please sign up again to get a new code "
            },{
                status:400
            }
        )
    }
    else{
         return Response.json(
            {success:false,
                message:"incorrect verification code"
            },{
                status:400
            }
        )
    }
        
    } catch (error) {
         console.error("Error verifiying user :",error)
        return Response.json(
            {success:false,
                message:"Error verifiying user"
            },{
                status:500
            }
        )
    }
    
}