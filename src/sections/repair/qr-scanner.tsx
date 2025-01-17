"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import dynamic from "next/dynamic";

const DynamicQrScanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner),
  {
    ssr: false,
  }
);

interface QrScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

export function QrScannerDialog({ onResult, onClose }: QrScannerProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl sm:max-w-[600px] bg-gradient-to-br from-gray-900/90 to-black/90 border-none [&>button[aria-label='Close']]:hidden">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-1 bg-white/90 rounded-full p-2.5 shadow-lg hover:bg-white transition-all duration-200 z-50 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-800"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div className="relative aspect-square bg-black/20 backdrop-blur-md rounded-2xl p-6">
          {/* Overlay scan frame */}
          <div className="absolute inset-0 z-10 pointer-events-none p-8">
            <div className="w-full h-full border-[3px] border-dashed border-blue-400/80 rounded-2xl animate-pulse" />
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-blue-500 rounded-br-2xl" />
            
            {/* Scanning line animation */}
            <div className="absolute top-0 left-0 w-full animate-scan">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </div>
          </div>

          {/* Scanner */}
          <div className="rounded-2xl overflow-hidden h-full shadow-2xl">
            <DynamicQrScanner
              audio={false}
              onDecode={onResult}
              onError={(error) => {
                console.error(error);
              }}
              constraints={{
                facingMode: "environment",
              }}
              containerStyle={{ borderRadius: "1rem", height: "100%" }}
              videoStyle={{
                borderRadius: "1rem",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
