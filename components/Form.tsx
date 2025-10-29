"use client";

import React, { useState } from "react";

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
import ResumeUploader from "./Uploader";
import { FormsData } from "@/types";
import Image from "next/image";

{
  /**zod schema for user details */
}
const levelEnum = z.enum(["Entry level", "Mid Level", "Senior Level"]);

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormsData>({
    jobTitle: "",
    jobDescription: "",
    experienceLevel: "",
    resumeUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, experienceLevel: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.resumeUrl) {
      alert("Please upload a Resume to scan");
      return;
    }
    setLoading(true);
    console.log(formData);
    console.log(loading);
    // Your submission logic here
  };

  return (
    <div className="w-full mt-3">
      {loading ? (
        <div className="flex flex-col justify-center items-center">
          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl">
            Uploading Resume...
          </p>
          <Image
            src="/scanning-lens.svg"
            alt="Scanning"
            width={400}
            height={400}
          />
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
              <ResumeUploader
                onUploadComplete={(url) =>
                  setFormData((prev) => ({ ...prev, resumeUrl: url }))
                }
                onUploadError={() => alert("Resume upload failed")}
              />
            </div>

            <Button type="submit">Analyze My Resume</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Form;
