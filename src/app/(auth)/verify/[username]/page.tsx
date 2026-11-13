"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

const VerifyAccountForm = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast.add({
        type: "success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast.add({
        type: "error",
        title: "signup failed",
        description:
          axiosError.response?.data.message ?? "error checking username",
        priority: "high",
      });
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div
          className="w-full max-w-md p-8 space-y-8 bg-white
        rounded-lg shadow-md"
        >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Vefify your Account
            </h1>
            <p className="mb-4 ">
              Enter the verification code sent to your email
            </p>
          </div>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldSet className="gap-4">
                <FieldGroup className="gap-4">
                  <Controller
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldLabel htmlFor="username-input">
                            VerificationCode
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...field}
                              placeholder="code"
                              autoComplete="off"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Submit
                  </Button>
                </FieldGroup>
              </FieldSet>
            </form>
          </CardContent>
        </div>
      </div>
    </>
  );
};

const VerifyAccount = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center">
        Loading verification form...
      </div>
    }
  >
    <VerifyAccountForm />
  </Suspense>
);

export default VerifyAccount;
