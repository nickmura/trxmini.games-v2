import { ChessLobby } from "./_components/Lobby";
import { LobbyWrapper } from "./_components/LobbyWrapper";

const ChessLobbyPage = () => {
  return (
    <LobbyWrapper>
      <div>
        <div className="mt-12 text-center">
          <p className="bg-gradient-to-t from-blue-400 to-blue-600 text-4xl font-black text-transparent bg-clip-text ">
            Game Lobbies
          </p>
          <p className="text-lg mt-4 text-gray-600">
            Join any room to start playing instantly
          </p>
        </div>
        <ChessLobby />
      </div>
    </LobbyWrapper>
  );
};

export default ChessLobbyPage;
