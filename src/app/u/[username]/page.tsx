"use client";
import { Button } from "@/components/ui/button";
import { messageSchema } from "@/schemas/messageSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Suspense, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Loader2 } from "lucide-react";

function ProfilePageContent() {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isCheckingMessage,setIsCheckingMessage]= useState(false)
  const { username } = useParams<{ username: string }>();

 const form = useForm<z.infer<typeof messageSchema>>({
  resolver: zodResolver(messageSchema),
  mode: "onChange",
  defaultValues: { content: "" },
});

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      if (!response.data.success) {
        toast.add({
          type: "error",
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ?? "error checking username";

      toast.add({
        type: "error",
        title: "signup failed",
        description: errorMessage,
        priority: "high",
      });
    }
  };

  return (
    <>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className=" text-center text-4xl font-bold mb-4">
          Public Profile Link
        </h1>

        <div className="mb-4">
          <CardContent>
            <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="content"
                  control={form.control}
                  render={({ field ,fieldState}) => (
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="username-input">
                           Send an anonymous message
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="write your annonymous message here"
                            type="text"
                            autoComplete="off"
                          />
                        </InputGroup>
                       
                          {isCheckingMessage && <Loader2 className="animate-spin"/>}

                          <p className={`text-sm ${fieldState.error?.message?'text-red-500':'text-green-500'}`}>
                            test {fieldState.error?.message}
                          </p>
                      </FieldContent>
                    </Field>
                  )}
                />

                <Button type="submit" >
                  Submit
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </div>

        <div>
          <div className="text-lg font-semibold mb-2">
            <Button>Suggest Messages</Button>
            <h2>click on any message below to select it </h2>
          </div>
          <h2>Messages</h2>
          <p>{}</p>
        </div>
      </div>
    </>
  );
}

function Page() {
  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      <ProfilePageContent />
    </Suspense>
  );
}

export default Page;
