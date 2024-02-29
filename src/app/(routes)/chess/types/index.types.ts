export type IChessRoomState = {
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
  endedAt?: string; // Date;
  winner?: string;
};

export type IChat = {
  id: string;
  sender: string | number;
  message: string;
  date: string;
};
