import { startGameDialogAtom } from "@/atoms/startGameDialog.atom";
import { useSocket } from "@/components/LayoutWrapper";
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
import { useStore } from "@/store";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

export const LeaveGameDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const socket = useSocket();

  const { chess, userSession } = useStore();

  const handleLeaveGame = () => {
    if (!socket || !chess?.roomId || !userSession?.id)
      return toast.error(`Couldn't leave the game.Please try again later!`);

    toast.loading("Leaving the game...", { id: "end:chess" });
    socket?.emit("end:chess", {
      roomId: chess.roomId,
      userId: userSession.id,
    });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="text-center">Are you sure you want to lose?</div>
            <div className="text-center text-sm text-gray-500 font-normal mt-2">
              When you quit the game, it will count as a loss and your opponent
              will win and get the wager.
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="grid place-items-center py-8">
              {/* eslint-disable-next-line  */}
              <img
                src="/images/site/pieces.png"
                alt=""
                className="bg-red-400 object-fill"
                width={200}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center items-center sm:justify-center gap-4">
          <AlertDialogCancel onClick={() => handleLeaveGame()}>
            Yes, Quit!
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
