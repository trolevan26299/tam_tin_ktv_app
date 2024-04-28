"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicQrScanner = dynamic(() => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner), {
  ssr: false,
});

const Device = () => {
  const [state, setState] = useState<{
    stop: boolean;
    title: string;
    device: any;
  }>({
    stop: false,
    title: "",
    device: {},
  });

  const getDeviceById = async (id: string) => {
    try {
      const res = await fetch(`/api/device/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data) {
        setState((prev) => ({ ...prev, device: data }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex min-h-screen items-center text-black h-screen items-center justify-center flex-col">
      {!state.title ? (
        <DynamicQrScanner
          containerStyle={{
            height: "200px",
            width: "100%",
            marginBottom: "10px",
          }}
          stopDecoding={!state.stop}
          onDecode={async (value) => {
            if (value) {
              getDeviceById(value);
              setState({ ...state, title: value, stop: !state.stop });
            }
          }}
          onError={(error) => console.error(error.message)}
          audio={false}
        />
      ) : (
        <span className="text-white">
          {state.title}
          {state.device.belong_to}
        </span>
      )}

      <Button
        className="p-2 px-5 mt-5 rounded-full"
        variant="outline"
        onClick={() => {
          setState({ ...state, title: "", stop: !state.stop });
        }}
      >
        {!state.stop ? "Start" : "Stop"}
      </Button>
    </div>
  );
};

export default Device;
