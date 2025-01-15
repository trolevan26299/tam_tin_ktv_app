"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import dynamic from "next/dynamic";

const DynamicQrScanner = dynamic(() => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner), {
  ssr: false,
});

interface QrScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

export function QrScannerDialog({ onResult, onClose }: QrScannerProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="relative aspect-square bg-white/50 backdrop-blur-sm rounded-2xl p-4">
          {/* Overlay scan frame */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="w-full h-full border-2 border-dashed border-blue-500 rounded-lg animate-pulse" />
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
          </div>

          {/* Scanner */}
          <div className="rounded-lg overflow-hidden h-full">
            <DynamicQrScanner
              audio={false}
              onDecode={onResult}
              onError={(error) => {
                console.error(error);
              }}
              constraints={{
                facingMode: "environment"
              }}
              containerStyle={{ borderRadius: "0.5rem", height: "100%" }}
              videoStyle={{
                borderRadius: "0.5rem",
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