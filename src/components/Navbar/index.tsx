import { Bell, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { StartGame } from "./StartGame";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center h-16 =bg-red-500">
      <div>
        <Link href="/">
          <span className="text-lg block italic text-blue-500">
            trxmini.games
          </span>
        </Link>
      </div>
      <div className="flex gap-4">
        <a href="#" className="cursor-not-allowed opacity-50">
          About
        </a>
        <a href="#" className="cursor-not-allowed opacity-50">
          Games
        </a>
        <a href="#" className="cursor-not-allowed opacity-50">
          Roadmap
        </a>
        <a href="#" className="cursor-not-allowed opacity-50">
          FAQs
        </a>
        <a href="#" className="cursor-not-allowed opacity-50">
          Whitepaper
        </a>
      </div>
      <div className="flex items-center justify-between gap-4">
        {/* <button className="cursor-not-allowed opacity-50">
          <Bell />
        </button> */}
        <StartGame />
        {/* <button className="cursor-not-allowed opacity-50">
          <Sun />
        </button> */}
      </div>
    </nav>
  );
};
