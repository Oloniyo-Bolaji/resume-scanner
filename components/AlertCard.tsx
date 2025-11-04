import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertProps } from "@/types";

const Alerts = ({ icon, message, title }: AlertProps) => {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in duration-300">
      <Alert className={` flex gap-2.5 ${title === "Success" ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700 " } shadow-md flex items-start gap-2 p-4 rounded-md w-[300px]`}>
        {icon && <div className="mt-0.5">{icon}</div>}
        <div className="flex flex-col justify-start items-start">
          <AlertTitle className="font-semibold">{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
      </Alert>
    </div>
  );
};

export default Alerts;
