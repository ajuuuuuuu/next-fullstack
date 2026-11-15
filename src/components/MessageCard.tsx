"use client";
import {
  Card,
  CardAction,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "@/components/ui/toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";

type MessageCardProp = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
function MessageCard({ message, onMessageDelete }: MessageCardProp) {
  const createdAt = new Date(message.createdAt);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );
      toast.add({
        title: response.data.message,
      });
      onMessageDelete(String(message._id));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        type: "error",
        title: "Failed to delete message",
        description: axiosError.response?.data.message ?? "Please try again",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-center">
          <div className="min-w-0 text-bold">
            <p className="whitespace-pre-wrap wrap-break-words">{message.content}</p>
            <time
              dateTime={createdAt.toISOString()}
              className="mt-2 block text-xs text-muted-foreground"
            >
              {createdAt.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </time>
          </div>
          <CardAction className="row-span-1 self-center">
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label="Delete message"
                  />
                }
              >
                <X />
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This message will be
                    permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        </CardHeader>
      </Card>
    </>
  );
}

export default MessageCard;
