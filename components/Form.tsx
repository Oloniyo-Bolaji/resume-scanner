"use client";

import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { AlertProps, FormsData } from "@/types";
import Image from "next/image";
import { convertPDFToImages } from "@/lib/convertPdfToImage";
import { useDropzone } from "react-dropzone";
import { Ban, FileUp, X } from "lucide-react";
import Alerts from "./AlertCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

//zod schema for experience level

const levelEnum = z.enum(["Entry level", "Mid Level", "Senior Level"]);

const Form = () => {
  const router = useRouter();
  const { data: session } = useSession();

  //States
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [formData, setFormData] = useState<FormsData>({
    company: "",
    jobTitle: "",
    jobDescription: "",
    experienceLevel: "",
    resume: undefined,
    imagePaths: [],
  });
  const userId = session?.user?.id;

  //Function for handling input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Function for handling select change
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, experienceLevel: value }));
  };

  //Function for file selection, both select and drop usin react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      //Validate file type and size
      if (file.type !== "application/pdf") {
        setAlert({
          icon: <Ban />,
          title: "Error",
          message: "Please upload a PDF file",
        });
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        // 4MB limit
        setAlert({
          icon: <Ban />,
          title: "Error",
          message: "File size must be less than 4MB",
        });
        return;
      }

      setFormData((prev) => ({ ...prev, resume: file }));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 4 * 1024 * 1024, // 4MB
    multiple: false, // Only allow single file
  });

  //Function to un-select file
  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, resume: undefined }));
  };

  //Function for file submit
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.resume) {
      setAlert({
        icon: <Ban />,
        title: "Error",
        message: "Please upload a Resume to scan",
      });
      return;
    }
    setLoading(true);
    setStatus("Uploading resume...");

    const images = await convertPDFToImages(formData.resume);

    if (images) {
      setStatus("Processing resume...");
      const id = crypto.randomUUID();
      if (!session?.user?.id) {
        setAlert({
          icon: <Ban />,
          title: "Authentication Required",
          message: "Please sign in to analyze your resume",
        });
        return;
      }
      const updatedFormData = {
        id: id,
        company: formData.company,
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        experienceLevel: formData.experienceLevel,
        resume: formData.resume,
        imagePaths: images,
      };

      setFormData(updatedFormData);
      // Send to backend immediately with the updated data for Groq analysis
      try {
        setStatus("Analyzing Resume...");
        const response = await fetch("/api/resume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, data: updatedFormData }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit");
        }

        const result = await response.json();
        if (result.success) {
          console.log("Success:", result);
          setStatus("Processing Feedback, Re-directing...");

          // Store data in sessionStorage with a unique key
          const storageKey = `resumeAnalysis_${id}`;
          sessionStorage.setItem(
            storageKey,
            JSON.stringify({
              analysis: result.data,
              images: updatedFormData.imagePaths,
              id: id,
              timestamp: new Date().toISOString(),
            })
          );

          // Navigate to results page with the ID
          router.push(`/resume-review?id=${id}`);
        }
      } catch (error) {
        console.error("Error:", error);
        setStatus("Error submitting form");
        setAlert({
          icon: <Ban />,
          title: "Error",
          message: "Failed to submit. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      //what should happen if it doesnt convert pdf to image
      setLoading(false);
      setAlert({
        icon: <Ban />,
        title: "Error",
        message: "Failed to process Resume for analysis",
      });
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
    <div className="w-full mt-3">
      {loading ? (
        <div className="flex flex-col justify-center items-center">
          <p className="mt-3 text-base md:text-xl text-slate-600 max-w-2xl">
            {status}
          </p>
          <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] mt-6">
            <Image
              src="/scanning-lens.svg"
              alt="Scanning"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 80vw, 400px"
              priority
            />
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="e.g Frontend Developer"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                name="company"
                placeholder="e.g Google"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                rows={6}
                id="jobDescription"
                name="jobDescription"
                placeholder="Paste the Job Description here"
                value={formData.jobDescription}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level of experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Experience Level</SelectLabel>
                    {levelEnum.options.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Resume</Label>

              <div className="w-full">
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-[#003285] rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <input {...getInputProps()} />
                  <div>
                    {formData.resume ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="relative w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5">
                            <Image
                              src="/pdflogo.jpg"
                              alt="logo"
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 80vw, 20px"
                              priority
                            />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {formData.resume.name}
                          </p>
                          <button onClick={handleRemoveFile}>
                            <X className="opacity-50 text-sm" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center gap-2.5">
                        <FileUp size={40} className="animate-pulse" />
                        <p className="text-gray-700">
                          Drag and drop your resume here
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          or click to browse (PDF only, max 4MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit">Analyze Resume</Button>
          </div>
        </form>
      )}
      {alert && (
        <Alerts icon={alert.icon} message={alert.message} title={alert.title} />
      )}
    </div>
  );
};

export default Form;
