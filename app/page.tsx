"use client";

import Alerts from "@/components/AlertCard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { AlertProps } from "@/types";
import { MoveUpRight, ShieldAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [alert, setAlert] = useState<AlertProps | null>(null);

  //Function to navigate to upload resume page, and conditions
  const handleTryForFree = () => {
    if (!session) {
      router.push("/login");
      setAlert({
        icon: <ShieldAlert />,
        title: "Error",
        message: "Please Login!",
      });
    } else router.push("/upload-resume");
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
    <div className="px-6 md:px-16 lg:px-40 py-2.5">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen text-center ">
        <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight text-[#003285]">
          AI That Reads Your Résumé Like a Recruiter
        </h1>

        <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
          Our AI-powered résumé scanner instantly checks your résumé against job
          descriptions, highlights missing keywords, and gives you actionable
          insights to boost your chances of getting hired.
        </p>

        <Button variant="default" className="mt-3" onClick={handleTryForFree}>
          Try For Free
          <span className="p-2 rounded-full">
            <MoveUpRight />
          </span>
        </Button>
      </main>

      {alert && (
        <Alerts icon={alert.icon} message={alert.message} title={alert.title} />
      )}
    </div>
  );
};

export default Home;
