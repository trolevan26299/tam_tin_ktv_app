"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Combobox } from "@/sections/repair/combobox";
import { SplashScreen } from "@/components/loading-screen";
import { QrScannerDialog } from "@/sections/repair/qr-scanner";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

type LinhKienItem = {
  _id: string;
  name_linh_kien: string;
  total: number;
};

type RepairFormValues = {
  deviceId: string;
  type: "Sửa chữa" | "Bảo dưỡng";
  linhKienList: {
    linhKien: LinhKienItem | null;
    quantity: number;
  }[];
  note: string;
};

export function RepairView() {
  const [loading, setLoading] = useState(true);
  const [linhKienOptions, setLinhKienOptions] = useState<LinhKienItem[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const router = useRouter();

  const form = useForm<RepairFormValues>({
    defaultValues: {
      deviceId: "",
      type: "Sửa chữa",
      linhKienList: [{ linhKien: null, quantity: 1 }],
      note: "",
    },
    mode: "onChange",
    resolver: (values) => {
      const errors: any = {};

      if (!values.deviceId) {
        errors.deviceId = {
          type: "required",
          message: "Vui lòng nhập mã thiết bị",
        };
      }

      if (!values.type) {
        errors.type = {
          type: "required",
          message: "Vui lòng chọn loại",
        };
      }

      if (!values.linhKienList.every((item) => item.linhKien !== null)) {
        errors.linhKienList = {
          type: "validate",
          message: "Vui lòng chọn linh kiện cho tất cả các dòng",
        };
      }

      return {
        values,
        errors: Object.keys(errors).length > 0 ? errors : {},
      };
    },
  });

  useEffect(() => {
    const fetchLinhKien = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get("/api/linhKien", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (Array.isArray(response.data)) {
          setLinhKienOptions(response.data);
        } else {
          setLinhKienOptions([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách linh kiện:", error);
        setLinhKienOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLinhKien();
  }, []);

  const onSubmit = async (values: RepairFormValues) => {
    const authToken = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/device/repair",
        {
          id_device: values.deviceId,
          type_repair: values.type,
          date_repair: new Date().toISOString().split("T")[0],
          linh_kien: values.linhKienList.map((item) => ({
            id: item.linhKien?._id,
            name: item.linhKien?.name_linh_kien,
            total: item.quantity,
          })),
          note: values.note,
          staff_repair: {
            id: userData.id,
            name: userData.name || "",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công !",
          description: "Thiết bị đã được cập nhật thành công !",
          variant: "default",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast({
        title: "Lỗi khi cập nhật",
        description: "Lỗi khi cập nhật",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 relative">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl -z-10" />

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cập nhật sửa chữa
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg space-y-3">
              {/* Device ID Field */}
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm font-medium">Mã thiết bị</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Nhập hoặc quét mã thiết bị" {...field} className="bg-white" />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowScanner(true)}
                          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                        >
                          Quét QR
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Loại</FormLabel>
                    <div className="flex gap-4">
                      <div
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          field.value === "Sửa chữa" ? "bg-blue-500 text-white shadow-lg" : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => field.onChange("Sửa chữa")}
                      >
                        <input
                          type="radio"
                          id="repair"
                          {...field}
                          value="Sửa chữa"
                          checked={field.value === "Sửa chữa"}
                          className="w-4 h-4 mr-2 accent-white"
                        />
                        <label htmlFor="repair" className="text-sm cursor-pointer">
                          Sửa chữa
                        </label>
                      </div>
                      <div
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          field.value === "Bảo dưỡng"
                            ? "bg-blue-500 text-white shadow-lg"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => field.onChange("Bảo dưỡng")}
                      >
                        <input
                          type="radio"
                          id="maintenance"
                          {...field}
                          value="Bảo dưỡng"
                          checked={field.value === "Bảo dưỡng"}
                          className="w-4 h-4 mr-2 accent-white"
                        />
                        <label htmlFor="maintenance" className="text-sm cursor-pointer">
                          Bảo dưỡng
                        </label>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {/* Linh kiện Fields */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Danh sách linh kiện</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentList = form.getValues("linhKienList");
                      form.setValue("linhKienList", [...currentList, { linhKien: null, quantity: 1 }]);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    + Thêm linh kiện
                  </Button>
                </div>

                {form.watch("linhKienList").map((_, index) => (
                  <div key={index} className="flex items-end gap-4 bg-gray-50 p-4 rounded-lg">
                    <FormField
                      control={form.control}
                      name={`linhKienList.${index}.linhKien`}
                      render={({ field }) => (
                        <FormItem className="w-[67%]">
                          <FormControl>
                            <Combobox
                              options={linhKienOptions}
                              value={field.value}
                              onChange={field.onChange}
                              displayField="name_linh_kien"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`linhKienList.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="w-[20%]">
                          <FormControl>
                            <Input type="number" min="1" {...field} className="bg-white" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      className="w-[13%]"
                      size="icon"
                      onClick={() => {
                        const currentList = form.getValues("linhKienList");
                        if (currentList.length > 1) {
                          form.setValue(
                            "linhKienList",
                            currentList.filter((_, i) => i !== index)
                          );
                        }
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>

              {/* Note Field */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung sửa chữa"
                        {...field}
                        className="bg-white resize-none"
                        rows={4}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                disabled={!form.formState.isValid}
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
              >
                Cập nhật lịch sử sửa chữa
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white"
              >
                Quay lại
              </Button>
            </div>
          </form>
        </Form>

        {showScanner && (
          <QrScannerDialog
            onResult={(result) => {
              form.setValue("deviceId", result);
              setShowScanner(false);
            }}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </div>
  );
}
