import React from "react";

const Divider = () => {
  return (
    <div className="relative my-1.5 mx-2.5">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-muted-foreground">or</span>
      </div>
    </div>
  );
};

export default Divider;
