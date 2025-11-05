"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  //Creating name initials for placeholder for users avatar
  const initials =
    user?.name &&
    user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  //Link and avatar display, if user is signed in and has and image(Google Authentication) display image else their name initials and if session doesnt exist, display authentication buttons
  
  return (
    <nav className="nav rounded-2xl py-2.5 px-5 flex justify-between items-center">
      <Link href="/" className="font-bold uppercase text-sm text-[#003285]">
        YourResumeScanner
      </Link>

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
          <Button variant="outline" onClick={handleLogin}>
            Login
          </Button>
          <Button onClick={handleSignUp}>Signup</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
