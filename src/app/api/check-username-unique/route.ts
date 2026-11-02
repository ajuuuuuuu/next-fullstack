import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import {z} from "zod"
import {usernameValidation} from '@/schemas/signupSchema'

//usernameValid se query Schema banate h ->check any varible or object
const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request) {
    await dbConnect()

    try{
        const {searchParams} = new URL(request.url)
        const queryParam ={
            username:searchParams.get('username')
        }
        //validate with zod
       const result = UsernameQuerySchema.safeParse(queryParam)
       console.log(result)
       if(!result.success){
        const usernameErrors =result.error.format().username?._errors || []
        return Response.json({
            success:false,
            message:usernameErrors?.length>0?usernameErrors.join(', '):'invalid username',
        },{status:400})
       }
    }catch(error){
        console.error("error checking username :",error)
        return Response.json(
            {success:false,
                message:"error checking username"
            },{
                status:500
            }
        )
    }
    
}