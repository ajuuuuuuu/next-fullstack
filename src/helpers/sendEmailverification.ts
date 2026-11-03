import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse> {
    try{
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry Message | Verification Code',
            react: VerificationEmail({username,otp:verifyCode}),
        });

        if (error) {
            console.error("Resend rejected verification email", error);
            return {
                success: false,
                message: `Failed to send verification email: ${error.message}`,
            };
        }

        if (!data) {
            console.error("Resend did not return an email result");
            return {
                success: false,
                message: "Failed to send verification email: no result returned",
            };
        }

        return{success:true,message:" verification email send successfully"}

    }catch(emailError){
        console.error("Error sending verification email",emailError)
        const message = emailError instanceof Error ? emailError.message : "Unknown email error";
        return{success:false,message:`Failed to send verification email: ${message}`}
    }
}
