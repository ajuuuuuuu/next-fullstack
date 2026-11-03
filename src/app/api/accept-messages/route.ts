import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"


export async function POST(request:Request) {
    await dbConnect()
    // currently logged in user
    const session = await  getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json(
    {
      success: false,
      message: "Not Authenticated",
     
    },
    { status: 401 }
  );
    }

    const userId = user._id
    const {acceptMessages}=await request.json()
    
    try{
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:acceptMessages
        },{
            new:true
        })

        if(!updatedUser){
            return Response.json(
    {
      success: false,
      message: "failed to update user staus to accept messages",
      
    },
    { status: 401 }
  );
        }
        return Response.json(
    {
      success: true,
      message: "message acceptence status updated succesfully",
      updatedUser
     
    },
    { status: 200 }
  );
    }catch(error){
        console.log("failed to update user staus to accept messages")
        return Response.json(
    {
      success: false,
      message: "failed to update user status to accept messages",
      
    },
    { status: 500 }
  );
    }


}

export async function GET(request:Request) {
    await dbConnect()
    // currently logged in user
    const session = await  getServerSession(authOptions)
    const user:User = session?.user as User
    
    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
                
            },
            { status: 401 }
        );
    }
    
    const userId = user._id
    
    try{
    const foundUser =await UserModel.findById(userId)
    
    if(!foundUser){
            return Response.json(
    {
      success: false,
      message: "user not found ",
      
    },
    { status: 404 }
  );
        }



         return Response.json(
    {
      success: true,
      isAccptingMessages:foundUser.isAcceptingMessage,
      message: "user  found ",
      
    },
    { status: 200 }
  );



    }
    catch(error){
    console.log("An unexpected error occured :",error)
        return Response.json(
    {
      success: false,
      message: "internal server error",
      
    },
    { status: 500 }
  ); 
    }
}