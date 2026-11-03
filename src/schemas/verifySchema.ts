import {z} from "zod"

export const verifySchema = z.object({
    username:z.string()
    .min(2,"username must be atleast 2 characters")
    .max(20,"username must be no more then 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"username must not contain special character"),

    code:z.string().regex(/^\d{6}$/, "Code must be exactly 6 digits")
})