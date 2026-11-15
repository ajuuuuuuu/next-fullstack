"use client";
import { Button } from "@/components/ui/button";
import { messageSchema } from "@/schemas/messageSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function ProfilePageContent() {
  const [isCheckingMessage, setIsCheckingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    mode: "onChange",
    defaultValues: { content: "" },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setErrorMessage(null);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      if (!response.data.success) {
        setErrorMessage(response.data.message);
        toast.add({
          type: "error",
          description: response.data.message,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Message sent",
        description: "Your anonymous message was sent.",
      });

      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data.message ?? "error checking username";
      setErrorMessage(message);

      toast.add({
        type: "error",
        title: "Failed to send message",
        description: message,
        priority: "high",
      });
    }
  };

  const suggestMessage = async () => {
    setLoading(true);

    try {
      const response = await axios.post<{
        success: boolean;
        questions?: string;
        message?: string;
      }>("/api/suggest-messages");

      if (!response.data.success) {
        throw new Error(response.data.message ?? "failed to get suggestion");
      }
      const suggestion = (response.data.questions ?? "")
        .split("||")
        .map((question) => question.trim())
        .filter(Boolean);

      setSuggestedMessages(suggestion);

      toast.add({
        type: "success",
        title: "messages fetched ",
        description: "successfully get your messages",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data.message ??
        "something happend while chapgpt ai";

      const gpterror =
        error instanceof Error ? error.message : "Failed to get suggestions";
      setErrorMessage(gpterror);

      toast.add({
        type: "error",
        description: message,
      });
    } finally {
      setLoading(false);
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
                  render={({ field, fieldState }) => (
                    <Field orientation="horizontal">
                      <FieldContent className="gap-3">
                        <FieldLabel htmlFor="username-input">
                          Send an anonymous message
                        </FieldLabel>
                        <InputGroup
                          className={
                            fieldState.error?.message || errorMessage
                              ? "border-red-500 has-[[data-slot=input-group-control]:focus-visible]:border-red-500"
                              : fieldState.isDirty && !fieldState.invalid
                                ? "border-green-500 has-[[data-slot=input-group-control]:focus-visible]:border-green-500"
                                : "border-neutral-400 dark:border-neutral-600"
                          }
                        >
                          <InputGroupInput
                            {...field}
                            onChange={(event) => {
                              field.onChange(event);
                              if (errorMessage) setErrorMessage(null);
                            }}
                            placeholder="write your annonymous message here"
                            type="text"
                            
                            autoComplete="off"
                          />
                        </InputGroup>

                        {isCheckingMessage && (
                          <Loader2 className="animate-spin" />
                        )}

                        <p
                          className={`text-sm ${
                            fieldState.error?.message || errorMessage
                              ? "text-red-500"
                              : `text-green-500`
                          }`}
                        >
                          {fieldState.error?.message || errorMessage}
                        </p>
                      </FieldContent>
                    </Field>
                  )}
                />

                <Button type="submit" className="w-15 h-8">
                  Submit
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </div>

        <div className="gap-30 mt-2">
          <div className="text-lg font-semibold mt-10">
            <Button type="button" onClick={suggestMessage}>
              Suggest Messages
            </Button>
            <h2 className="mt-2">click on any message below to select it </h2>
          </div>
          <h2 className="">Messages</h2>

          <div>
            {loading ? (
              <>
                <div className="mt-6 ">
                  <div className="flex w-full max-w-120 flex-col gap-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-3 flex flex-col items-start gap-2">
                {suggestedMessages.map((suggestion, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                     className="border-neutral-400 dark:border-neutral-600"
                    onClick={() =>
                      form.setValue("content", suggestion, {
                        shouldValidate: true,
                      })
                    }
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
          </div>
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
