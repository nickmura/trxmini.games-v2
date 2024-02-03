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
import { Dispatch, SetStateAction, useState } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAtom } from "jotai";
import { startGameDialogAtom } from "@/atoms/startGameDialog.atom";
import { useSocket } from "../LayoutWrapper";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  game: z.string({
    required_error: "Pleae choose a game to play!",
  }),
  wager: z
    .string({
      required_error: "Please enter trx to wager",
    })
    .min(0),
  // wagerless: z.boolean().default(false).optional(),
});
//   .refine((data) => {
//     console.log(data, "refine");
//     if (data.wagerless && !data.wager) {
//       return true;
//     }

//     return false;
//   });

export const StartGameDialog = () => {
  const [open, setOpen] = useAtom(startGameDialogAtom);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const socket = useSocket();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      game: "chess",
      //   wager: 100,
      //   wagerless: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    // socket?.emit("")
    const userId = String(Math.random());
    socket?.emit("join:chess", { userId });
    router.push("/chess?userId=" + userId);
  }

  return (
    <AlertDialog open={open.isOpen}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Create a game</AlertDialogTitle>
          <AlertDialogDescription>
            Select a game you want to play, select wager to stake or go
            wagerless!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="game"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a game" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="chess">Chess</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs font-semibold pl-0.5">
                    We&apos;re working hard to add more games
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wager"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormControl>
                    <Input
                      placeholder="Enter your wager (in TRX)"
                      {...field}
                      autoFocus
                      type="number"
                      min={0}
                    />
                  </FormControl>
                  <FormDescription className="text-xs font-semibold pl-0.5">
                    Enter 0 to go wagerless
                  </FormDescription>
                  {/* <FormDescription>
                    Here to look around? Try wagerless!
                    Select wagerless ption bre 
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="wagerless"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormControl>
                    <div className="flex items-center space-x-2 pl-0.5">
                      <Checkbox
                        className="rounded-[4px] h-4 w-4"
                        id="wagerless"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label
                        htmlFor="wagerless"
                        className="font-semibold text-gray-600"
                      >
                        Start wagerless
                      </Label>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Here to look around? Try wagerless! 
                    Select wagerless ption bre 
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <AlertDialogFooter className="mt-4">
              <AlertDialogAction type="submit">
                Start a {form.watch("game")} game
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
