import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export const ChatSidebar = () => {
  return (
    <div className="grid w-72 grid-rows-10 border border-blue-500 rounded-lg">
      <div className="row-span-9"></div>
      <div className="relative h-14 row-start-10 row-span-1 rounded-lg bottom-0 bg-gray-100">
        <textarea
          placeholder="Send a message..."
          name=""
          id=""
          className="bg-transparent resize-none w-full h-full p-2 focus:outline-none pr-10"
          //   style={{fieldS}}
        ></textarea>
        <Button
          size={"sm"}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};
