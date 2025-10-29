"use client"

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleForFree = () => {
    if (!session) {
      router.push("/login");
    } else router.push("/upload-resume");
  };

  return (
    <div className="bg-gradient px-6 md:px-16 lg:px-40 py-2.5 font-sans dark:bg-black">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen text-center ">
        <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
          AI That Reads Your Résumé Like a Recruiter.
        </h1>

        <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
          Our AI-powered résumé scanner instantly checks your résumé against job
          descriptions, highlights missing keywords, and gives you actionable
          insights to boost your chances of getting hired.
        </p>

        <Button variant="default" className="mt-3" onClick={handleForFree}>
          Try For Free
        </Button>
      </main>
    </div>
  );
};

export default Home;
