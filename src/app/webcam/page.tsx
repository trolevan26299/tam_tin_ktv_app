"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const DynamicQrScanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner),
  {
    ssr: false,
  }
);

export default function QRscanner() {
  const [stop, setStop] = useState<boolean>(true);
  const [title, setTitle] = useState<any>(undefined);
  return (
    <div className='flex min-h-screen flex-col items-center text-black h-screen'>
      {!title ? (
        <DynamicQrScanner
          containerStyle={{ height: "100%", width: "100%" }}
          stopDecoding={stop}
          onDecode={(value) => {
            if (value) {
              setTitle(value);
              setStop((val) => !val);
            }
          }}
          onError={(error) => console.error(error.message)}
          audio={false}
        />
      ) : (
        <span className='text-white'>{title}</span>
      )}
      <Button
        className='p-2 px-5 -mt-1 rounded-full'
        variant='outline'
        onClick={() => setStop((val) => !val)}
      >
        {stop ? "Start" : "Stop"}
      </Button>
    </div>
  );
}
