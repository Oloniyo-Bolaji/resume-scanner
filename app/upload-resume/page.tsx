import Form from "@/components/Form";
import Navbar from "@/components/Navbar";
import React from "react";

const UploadResume = () => {
  return (
    <div className="bg-gradient min-h-screen px-6 md:px-16 lg:px-40 py-2.5">
      <Navbar />
      <main className="flex flex-col items-center justify-center pt-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
          Upload your Resume
        </h1>
        <p className="my-3 text-sm md:text-base text-slate-600 max-w-2xl">
          Get instant feedback on your résumé’s strengths, weaknesses, and match
          rate with any job posting.
        </p>
        <Form />
      </main>
    </div>
  );
};

export default UploadResume;
