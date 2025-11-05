"use client";

import React, { useEffect, useState } from "react";
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
import { AlertProps, User } from "@/types";
import Divider from "@/components/Divider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Alerts from "@/components/AlertCard";
import { Check, ShieldAlert } from "lucide-react";

const Page = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);
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
        setAlert({
          icon: <ShieldAlert />,
          title: "Error",
          message: result.error,
        });
      } else {
        setAlert({
          icon: <Check />,
          title: "Success",
          message: "Login successful!",
        });
        router.push("/");
      }
    } catch (error) {
      setAlert({
        icon: <ShieldAlert />,
        title: "Error",
        message: "An error occurred during login, Please try again!",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setAlert({
        icon: <ShieldAlert />,
        title: "Error",
        message: "Failed to sign in with Google, Please try again!",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm px-2.5">
        <CardHeader>
          <CardTitle className="text-[#003285]">
            Login to YourResumeScanner
          </CardTitle>
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

              <Button type="submit" disabled={loading} className="w-full my-2">
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
            disabled={loading}
          >
            <GoogleIcon /> Sign up with Google
          </Button>

          <div className="flex items-center">
            <p className="text-sm">A new user?</p>
            <Link
              href="/signup"
              className="text-sm text-blue-600 hover:underline"
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
      {alert && (
        <Alerts icon={alert.icon} message={alert.message} title={alert.title} />
      )}
    </div>
  );
};

export default Page;
