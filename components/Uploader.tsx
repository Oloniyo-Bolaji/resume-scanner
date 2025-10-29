import { useDropzone } from "@uploadthing/react";
import { useCallback, useState } from "react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import { useUploadThing } from "@/src/utils/useUploadThingHook";
import Image from "next/image";
import { Check, FileUp, X } from "lucide-react";

interface ResumeUploaderProps {
  onUploadComplete: (url: string) => void;
  onUploadError?: () => void;
}

const ResumeUploader = ({
  onUploadComplete,
  onUploadError,
}: ResumeUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only take the first file
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
    setIsUploaded(false);
  }, []);

  const { startUpload, routeConfig, isUploading } = useUploadThing(
    "resumeUploader",
    {
      onClientUploadComplete: (res) => {
        // Get the URL from the upload response
        if (res && res[0]?.ufsUrl) {
          setIsUploaded(true);
          onUploadComplete(res[0].ufsUrl);
        }
      },
      onUploadError: () => {
        setIsUploaded(false);
        onUploadError?.();
        alert("error occurred while uploading");
      },
      onUploadBegin: (fileName) => {
        console.log("upload has begun for", fileName);
      },
    }
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
    maxFiles: 1, // Limit to 1 file
    disabled: isUploading, // Disable dropzone during upload
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
      >
        <input {...getInputProps()} />
        <div>
          {file ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Image src="/pdflogo.jpg" alt="logo" width={20} height={20} />
                <p className="text-sm text-gray-600">{file.name}</p>
                <button onClick={handleRemove}>
                  <X className={isUploading ? "opacity-50" : ""} />
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening file browser
                  if (!isUploaded) {
                    startUpload([file]); // startUpload expects an array
                  }
                }}
                disabled={isUploading || isUploaded}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 mx-auto bg-blue ${
                  isUploaded
                    ? "bg-green-600 text-white cursor-default"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                }`}
              >
                {isUploading ? (
                  "Uploading..."
                ) : isUploaded ? (
                  <>
                    <Check size={16} />
                    Uploaded
                  </>
                ) : (
                  "Upload Resume"
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-2.5">
              <FileUp size={40} className="animate-pulse" />
              <p className="text-gray-700">Drag and drop your resume here</p>
              <p className="text-sm text-gray-500 mt-2">
                or click to browse (PDF only, max 4MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;
