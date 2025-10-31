"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const initials =
    user?.name &&
    user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <nav className="bg-slate-50/90 rounded-2xl py-2.5 px-5 flex justify-between items-center">
      <Link href="/">YourResumeScanner</Link>

      {session ? (
        <Avatar>
          <AvatarImage
            src={user?.image || undefined}
            alt={user?.name || "User Avatar"}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex gap-2.5">
          <Button variant="outline">Login</Button>
          <Button>Signup</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
