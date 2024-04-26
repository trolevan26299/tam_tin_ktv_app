"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";

import DeviceModel from "@/models/Device";
import connect from "@/utils/db";

const DynamicQrScanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner),
  {
    ssr: false,
  }
);

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

  const getDeviceById = async (value: string) => {
    const device = await DeviceModel.findOne();
    if (device) {
      setState({ ...state, device });
    }
  };
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
          onDecode={async (value) => {
            await connect();
            if (value) {
              getDeviceById(value);
              setState({ ...state, title: value, stop: !state.stop });
            }
          }}
          onError={(error) => console.error(error.message)}
          audio={false}
        />
      ) : (
        <span className='text-white'>
          {state.title}
          {state.device.belong_to}
        </span>
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
};

export default Device;
