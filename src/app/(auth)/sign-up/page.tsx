"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import {useDebounceCallback } from "usehooks-ts";
import { toast } from "@/components/ui/toast";
import { signUpSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import {
  CardContent,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Loader2 } from "lucide-react";



const Page=()=> {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          console.log("this is response",response);
          console.log("this is response.data.message",response.data.message)
          setUsernameMessage(response.data.message);
        

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUserNameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("this is data in sign -up page :",data);
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
    //   console.log("this is response",response);

      toast.add({
        type: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "error checking username";

      toast.add({
        type: "error",
        title: "signup failed",
        description: errorMessage,
        priority: "high",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        className="w-full max-w-md p-8 space-y-8 bg-white
        rounded-lg shadow-md">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4 "> Sign up to start your anonymous adventure</p>
        </div>


         <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet className="gap-4">
            
            <FieldGroup className="gap-4">
              
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field}) => (
                    <Field
                      orientation="horizontal"
                    >
                      <FieldContent>
                        <FieldLabel htmlFor="username-input">
                          Username
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="username"
                            autoComplete="off"
                            onChange={(e)=>{
                              field.onChange(e)
                              debounced(e.target.value)
                            }}
                          />
                        </InputGroup>
                          {isCheckingUsername && <Loader2 className="animate-spin"/>}

                          <p className={`text-sm ${usernameMessage==="Username is unique"?'text-green-500':'text-red-500'}`}>
                            test {usernameMessage}
                          </p>
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field}) => (
                    <Field
                      orientation="horizontal"
                    >
                      <FieldContent>
                        <FieldLabel htmlFor="username-input">
                          email
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="email"
                            autoComplete="on"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  )}
                />
             
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field}) => (
                    <Field
                      orientation="horizontal"
                    >
                      <FieldContent>
                        <FieldLabel htmlFor="username-input">
                          password
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="password"
                            type="password"
                            autoComplete="on"
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  )}
                />
             
               <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
              >
               {
                isSubmitting ?(
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> please wait
                  </>
                ):('Signup')
               }
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
      <div className="text-center mt-4">
        <p>
          Already a memeber? {' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign in</Link>
        </p>
      </div>
      </div>
    </div>
  );
}

export default Page;
