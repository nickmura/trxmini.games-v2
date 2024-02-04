export type ISocketState = {
  roomId: string;
  player1: {
    userId: string | null;
    side: "w" | "b";
    isConnected: boolean;
  };
  player2: {
    userId: string | null;
    side: "w" | "b";
    isConnected: boolean;
  };
  fen: string;
  turn: "w" | "b";
  stake: number;
  onlineCount: number;
};

export type IChat = {
  id: string;
  sender: string | number;
  message: string;
  date: string;
};
