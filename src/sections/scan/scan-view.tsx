"use client";

import { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Device } from "@/types/device.type";
import dynamic from "next/dynamic";
const DynamicQrScanner = dynamic(() => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner), {
  ssr: false,
});

export const ScanPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(true);
  const [deviceHistory, setDeviceHistory] = useState<Device | null>(null);

  const handleDecode = async (result: string) => {
    console.log("result", result);
    setScanning(false);
    try {
      const response = await axios.get(`/api/device/${result}`);
      console.log("response", response.data);
      if (response.data) {
        setDeviceHistory(response.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Không tìm thấy thiết bị",
        description: "Mã QR không khớp với bất kỳ thiết bị nào trong hệ thống.",
      });
      setScanning(true);
    }
  };

  const handleError = (error: any) => {
    toast({
      variant: "destructive",
      title: "Lỗi camera",
      description:
        "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.",
    });
  };

  const handleScanAgain = () => {
    setDeviceHistory(null);
    setScanning(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Quét mã QR thiết bị
          </h1>
          <p className="text-gray-400 mt-2">Đặt mã QR vào khung hình để quét</p>
        </div>
        {!deviceHistory ? (
          <div className="relative aspect-square">
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="w-full h-full border-2 border-dashed border-blue-500 rounded-lg animate-pulse" />
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
            </div>

            {/* Scanner */}
            <div className="rounded-lg overflow-hidden h-full">
              {scanning && (
                <DynamicQrScanner
                  audio={false}
                  onDecode={async (value) => {
                    if (value) {
                       handleDecode(value);
                    }
                  }}
                  onError={handleError}
                  constraints={{ // Thêm cấu hình này
                    facingMode: "environment"
                  }}
                 
                  viewFinder={() => (
                    <div className="border-2 border-red-500 absolute top-0 left-0 w-full h-full" />
                  )}
                  containerStyle={{ borderRadius: "0.5rem", height: "100%" }}
                  videoStyle={{
                    borderRadius: "0.5rem",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin thiết bị</h2>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {/* Thông tin cơ bản */}
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-32">Tên thiết bị:</span>
                  <span>{deviceHistory.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-32">Mã thiết bị:</span>
                  <span>{deviceHistory.id_device}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-32">Trạng thái:</span>
                  <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    {deviceHistory.status}
                  </span>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Thông tin khách hàng</h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium min-w-32">
                      Loại khách hàng:
                    </span>
                    <span>{deviceHistory.type_customer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium min-w-32">
                      Tên khách hàng:
                    </span>
                    <span>{deviceHistory.name_customer}</span>
                  </div>
                </div>
              </div>

              {/* Lịch sử sửa chữa */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Lịch sử sửa chữa</h3>
                <div className="space-y-4">
                  {deviceHistory.history_repair?.map(
                    (repair: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {repair.type_repair}
                          </span>
                          <span className="text-sm text-gray-500">
                            {repair.date_repair}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm font-medium">
                            Nhân viên sửa chữa:{" "}
                          </span>
                          <span className="text-sm text-gray-600">
                            {repair.staff_repair || "Chưa có thông tin"}
                          </span>
                        </div>

                        {/* Danh sách linh kiện */}
                        <div className="mb-2">
                          <p className="text-sm font-medium mb-1">
                            Linh kiện thay thế:
                          </p>
                          <div className="grid gap-1">
                            {repair.linh_kien.map(
                              (lk: any, lkIndex: number) => (
                                <div
                                  key={lkIndex}
                                  className="text-sm flex justify-between"
                                >
                                  <span>{lk.name}</span>
                                  <span className="text-gray-600">
                                    Số lượng: {lk.total}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Ghi chú */}
                        <div className="text-sm">
                          <span className="font-medium">Ghi chú: </span>
                          <span className="text-gray-600">{repair.note}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
        <div className="flex justify-center gap-4 mt-6">
          {deviceHistory ? (
            <>
              <Button
                onClick={handleScanAgain}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
              >
                Quét tiếp
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900"
              >
                Về trang chủ
              </Button>
            </>
          ) : (
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900"
            >
              ← Quay lại
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
