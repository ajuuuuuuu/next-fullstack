"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "@/components/ui/toast";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log("result in sign in page :", result)
    if (result?.error) {
     if(result.error === 'CredentialsSignin'){
       toast.add({
        type: "error",
        title: "Login failed",
        description: "incorrect username or password",
      });
     }
     else{
       toast.add({
        type: "error",
        title: "login failed",
        description:result.error
      });
     }
    }
    if(result?.url){
      router.replace('/dashboard')
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        className="w-full max-w-md p-8 space-y-8 bg-white
        rounded-lg shadow-md"
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4 "> Sign in to start your anonymous adventure</p>
        </div>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet className="gap-4">
              <FieldGroup className="gap-4">
                <Controller
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="username-input">Email/Username</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="email/username"
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
                  render={({ field }) => (
                    <Field orientation="horizontal">
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
                >
                 Sign in
                </Button>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
        <div className="text-center mt-4">
          <p>
            Already not a memeber?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
