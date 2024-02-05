import { startGameDialogAtom } from "@/atoms/startGameDialog.atom";
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
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const CheckmateDialog = ({
  open,
  won,
}: {
  open: boolean;
  won: boolean;
}) => {
  const router = useRouter();

  const [, setIsOpen] = useAtom(startGameDialogAtom);
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="text-center">
              Checkmate! You {won ? "won" : "lost"}
            </div>
            {won && (
              <div className="text-center text-gray-500 font-medium text-base">
                Wohhoo
              </div>
            )}
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
          <AlertDialogAction
            onClick={() => setIsOpen({ isCloseable: true, isOpen: true })}
          >
            Start a new game
          </AlertDialogAction>
          <AlertDialogCancel onClick={() => router.push("/chess/lobby")}>
            Find other games
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
