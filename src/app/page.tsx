import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Bell, Sun } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="min-h-screen max-h-screen w-11/12 mx-auto lg:max-w-screen-xl">
        <Navbar />
        <div className="flex =bg-red-500 h-full py-16">
          <div className="basis-1/2">
            <div className="text-lg text-gray-500 font-medium">
              trxmini.games presents
            </div>
            <div className="mt-4 bg-gradient-to-t from-blue-400 to-blue-600 text-4xl font-black text-transparent bg-clip-text leading-snug tracking-normal">
              The First Multiplayer GameFi Mini Games/eSports platform on TRON &
              BTTC
            </div>
            <div className="mt-6">
              trxmini.games is a new multiplayer GameFi platform in beta
              providing and developing various minigames to play against your
              friends and users online.
              <span className="text-gray-600">
                Players can stake and wager against each other in our catalog of
                turn based, real time and upcoming existing games.
              </span>
            </div>
          </div>
          <div className="basis-1/2">
            <Image
              src="/images/home/hero.png"
              alt=""
              width={1080}
              height={1080}
            />
          </div>
        </div>
      </main>
    </>
  );
}
