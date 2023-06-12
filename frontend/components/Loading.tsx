import React from "react";
import Image from "next/image";
import fishing from "../images/fishing.webp"

const Loading = () => {
  return (
    <div className= "flex flex-col text-white items-center justify-center mb-10 md:mb-0 h-screen w-full">
        <Image src={fishing}
        alt="fishing"
        width={400}
        height={400}/>
        
      <h2 className="flex flex-col text-white text-center justify-center text-3xl font-bold animate-pulse mb-10 md:mb-0 w-full">
        Fishing...
      </h2>
    </div>
  );
};

export default Loading;
