import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useSocket } from "@/components/LayoutWrapper";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";

export const ChatSidebar = () => {
  const [message, setMessage] = useState("");
  const { chats, setChats, chess, userSession } = useStore();

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const userId = userSession?.id; // useUserId();
  const socket = useSocket();

  const scrollToLatestChat = () => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("chat:messages", (data) => {
      // console.log(data, "chat:messages");
      setChats(data?.data);
      scrollToLatestChat();
    });

    return () => {
      socket.off("chat:messages");
    };
  }, [socket, setChats]);

  useEffect(() => {
    if (!socket) return;

    socket.on("chat:new-message", (data) => {
      const temp = chats;
      temp?.push(data?.data);
      setChats(temp);
      scrollToLatestChat();
    });

    return () => {
      socket.off("chat:new-message");
    };
  }, [socket, setChats, chats]);

  useEffect(() => {
    if (!socket) return;

    socket.emit(`chat:messages`, { roomId: chess?.roomId });
  }, [socket, chess?.roomId]);

  const handleSendChat = () => {
    setMessage("");
    if (message)
      socket?.emit("chat:send-message", {
        roomId: chess?.roomId,
        userId,
        message,
      });
  };

  // console.log(chats, "chats");

  return (
    <div className="grid w-72 grid-rows-10 border border-blue-500 rounded-xl">
      <div className="row-span-9 px-2 py-2 space-y-2 overflow-y-auto max-h-[70dvh]">
        {chats?.map((chat) => {
          const isSender = chat.sender === userId;

          return (
            <div key={chat.id}>
              <div
                className={cn(
                  "rounded-xl p-2",
                  isSender
                    ? "bg-gray-50 rounded-br-none"
                    : "bg-gray-200 rounded-bl-none"
                )}
              >
                <div className="text-gray-500 text-sm">{chat.sender}</div>
                <div className="font-semibold text-gray-700">
                  {chat.message}
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-600 text-right">
                {moment(chat.date).fromNow()}
              </div>
            </div>
          );
        })}
        <div ref={lastMessageRef} />
      </div>
      <div className="relative h-14 row-start-10 row-span-1 rounded-b-xl bottom-0 bg-gray-100">
        <textarea
          placeholder="Send a message..."
          className="bg-transparent resize-none w-full h-full p-2 focus:outline-none pr-10"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <Button
          size={"sm"}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={handleSendChat}
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};
