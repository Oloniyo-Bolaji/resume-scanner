"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleIcon from "@/lib/icons/google";
import { User } from "@/types";
import Divider from "@/components/Divider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (result?.error) {
        alert(result.error);
      } else {
        alert("Login successful!");
        router.push("/"); // Redirect to dashboard or home page
      }
    } catch (error) {
      alert("An error occurred during login");
            console.log(error)

    } finally {
      setLoading(false);
    }
  };


   const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      alert("Failed to sign in with Google");
      console.log(error)
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient">
      <Card className="w-full max-w-sm px-2.5">
        <CardHeader>
          <CardTitle>Login to YourResumeScanner</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  required
                  value={user?.email}
                  onChange={handleChange}
                                    disabled={loading}

                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="*********"
                  value={user?.password}
                  onChange={handleChange}
                                    disabled={loading}

                />
              </div>

              <Button type="submit"                  disabled={loading}
 className="w-full my-2">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>

        {/* --- Divider --- */}
        <Divider />

        <CardFooter className="flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
onClick={handleGoogleSignIn}
            disabled={loading}          >
            <GoogleIcon /> Sign up with Google
          </Button>

          <div className="flex items-center">
            <p className="text-sm">A new user?</p>
 <Link href="/signup" className="text-sm text-blue-600 hover:underline">
              Register
            </Link>         
             </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
