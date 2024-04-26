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
  const [state, setState] = useState<{
    stop: boolean;
    title: string;
  }>({
    stop: false,
    title: "",
  });
  return (
    <div className='flex min-h-screen items-center text-black h-screen items-center justify-center flex-col'>
      {!state.title ? (
        <DynamicQrScanner
          containerStyle={{
            height: "200px",
            width: "100%",
            marginBottom: "10px",
          }}
          stopDecoding={!state.stop}
          onDecode={(value) => {
            if (value) {
              setState({ ...state, title: value, stop: !state.stop });
            }
          }}
          onError={(error) => console.error(error.message)}
          audio={false}
        />
      ) : (
        <span className='text-white'>{state.title}</span>
      )}
      <Button
        className='p-2 px-5 mt-5 rounded-full'
        variant='outline'
        onClick={() => {
          setState({ ...state, title: "", stop: !state.stop });
        }}
      >
        {!state.stop ? "Start" : "Stop"}
      </Button>
    </div>
  );
}
