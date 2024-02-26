import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAtom } from "jotai";
import { setNicknameDialogAtom } from "@/atoms/setNicknameDialog.atom";
import toast from "react-hot-toast";
import { useStore } from "@/store";

const formSchema = z.object({
  nickname: z
    .string({
      required_error: "Please enter a nickname!",
    })
    .min(3, "Nickname must be at least 3 characters long")
    .max(20, "Nickname cannot be longer than 20 characters "),
});

export const SetNicknameDialog = () => {
  const [open, setOpen] = useAtom(setNicknameDialogAtom);
  const [isLoading, setIsLoading] = useState(false);

  const { userSession } = useStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    toast.loading("Setting nickname...", { id: "set:nickname" });

    const resp = await fetch(
      `${process.env.BACKEND_API_URL_BASE}/user/nickname`,
      {
        method: "PATCH",
        body: JSON.stringify({ nickname: values.nickname }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const json = await resp.json();

    toast.dismiss("set:nickname");
    setIsLoading(false);

    if (json.nickname) {
      setOpen({
        isCloseable: false,
        isOpen: false,
      });
      return toast.success(
        `Successfully set your nickname to ${json.nickname}`
      );
    }

    toast.error(
      `Couldn't set your nickname currently. Please try again later!`
    );
    setIsLoading(false);
  };

  useEffect(() => {
    if (userSession === null) return;

    if (!userSession?.nickname) {
      setOpen({
        isCloseable: false,
        isOpen: true,
      });
    } else {
      setOpen({
        isCloseable: false,
        isOpen: false,
      });
    }
  }, [setOpen, userSession]);

  return (
    <AlertDialog open={open.isOpen}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>What should others call you?</AlertDialogTitle>
          <AlertDialogDescription>
            Set a nickname that will display your profile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter your nickname"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className="mt-4">
              <AlertDialogAction type="submit" disabled={isLoading}>
                Set nickname
              </AlertDialogAction>
              {open.isCloseable && (
                <AlertDialogCancel
                  onClick={() =>
                    setOpen({
                      isCloseable: false,
                      isOpen: false,
                    })
                  }
                >
                  Cancel
                </AlertDialogCancel>
              )}
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
