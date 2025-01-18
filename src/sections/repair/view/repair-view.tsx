"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Combobox } from "@/sections/repair/combobox";
import { SplashScreen } from "@/components/loading-screen";
import { QrScannerDialog } from "@/sections/repair/qr-scanner";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import {
  ICustomer,
  ILinhKienItem,
  RepairFormValues,
} from "@/types/customer.type";
import { CustomerDialog } from "../customer-dialog";

export function RepairView() {
  const [loading, setLoading] = useState(true);
  const [linhKienOptions, setLinhKienOptions] = useState<ILinhKienItem[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const router = useRouter();

  const form = useForm<RepairFormValues>({
    defaultValues: {
      deviceType: "TamTin",
      deviceId: "",
      customer: null,
      type: "Sửa chữa",
      linhKienList: [{ _id: "", name_linh_kien: null, total: 1 }],
      note: "",
    },
    mode: "onChange",
    resolver: (values) => {
      const errors: any = {};

      if (values.deviceType === "TamTin" && !values.deviceId) {
        errors.deviceId = {
          type: "required",
          message: "Vui lòng nhập mã thiết bị",
        };
      }

      if (values.deviceType === "Outside" && !values.customer) {
        errors.customer = {
          type: "required",
          message: "Vui lòng chọn khách hàng",
        };
      }

      if (!values.type) {
        errors.type = {
          type: "required",
          message: "Vui lòng chọn loại",
        };
      }

      if (!values.linhKienList.length) {
        errors.linhKienList = {
          type: "required",
          message: "Vui lòng thêm ít nhất một linh kiện",
        };
      }

      return {
        values,
        errors: Object.keys(errors).length > 0 ? errors : {},
      };
    },
  });

  const refreshCustomers = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get("/api/customers", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải lại danh sách khách hàng:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        // Luôn fetch danh sách linh kiện, không phụ thuộc vào deviceType
        const linhKienResponse = await axios.get("/api/linhKien", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (Array.isArray(linhKienResponse.data)) {
          setLinhKienOptions(linhKienResponse.data);
        } else {
          setLinhKienOptions([]);
        }

        // Chỉ fetch customers khi là thiết bị ngoài
        if (form.watch("deviceType") === "Outside") {
          const customersResponse = await axios.get("/api/customers", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (Array.isArray(customersResponse.data)) {
            setCustomers(customersResponse.data);
          } else {
            setCustomers([]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setLinhKienOptions([]);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchCustomers = async () => {
      if (form.watch("deviceType") === "Outside") {
        try {
          const authToken = localStorage.getItem("authToken");
          const customersResponse = await axios.get("/api/customers", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (Array.isArray(customersResponse.data)) {
            setCustomers(customersResponse.data);
          } else {
            setCustomers([]);
          }
        } catch (error) {
          console.error("Lỗi khi tải danh sách khách hàng:", error);
          setCustomers([]);
        }
      }
    };

    fetchCustomers();
  }, [form.watch("deviceType")]);

  const onSubmit = async (values: RepairFormValues) => {
    const authToken = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    try {
      setLoading(true);
      const endpoint =
        values.deviceType === "TamTin"
          ? "/api/device/repair"
          : "/api/customers/repair";
      const payload = {
        ...(values.deviceType === "TamTin"
          ? { id_device: values.deviceId }
          : { customer_id: values.customer?._id }),
        type_repair: values.type,
        date_repair: new Date().toISOString().split("T")[0],
        linh_kien: values.linhKienList.map((item) => ({
          id: item._id,
          name: item.name_linh_kien,
          total: item.total,
        })),
        note: values.note,
        staff_repair: {
          id: userData.id,
          name: userData.name || "",
        },
      };

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công !",
          description: "Cập nhật sữa chữa thành công !",
          variant: "default",
          color: "green",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast({
        title: "Lỗi khi cập nhật",
        description: "Lỗi khi cập nhật",
        variant: "destructive",
        color: "red",
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
              {/* Device Type Selector */}
              <FormField
                control={form.control}
                name="deviceType"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex gap-4 justify-center">
                      <div
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          field.value === "TamTin"
                            ? "bg-blue-500 text-white shadow-lg"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => field.onChange("TamTin")}
                      >
                        <input
                          type="radio"
                          {...field}
                          value="TamTin"
                          checked={field.value === "TamTin"}
                          className="w-4 h-4 mr-2 accent-white"
                        />
                        <label className="text-sm cursor-pointer">
                          Thiết bị Tâm Tín
                        </label>
                      </div>
                      <div
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          field.value === "Outside"
                            ? "bg-blue-500 text-white shadow-lg"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => field.onChange("Outside")}
                      >
                        <input
                          type="radio"
                          {...field}
                          value="Outside"
                          checked={field.value === "Outside"}
                          className="w-4 h-4 mr-2 accent-white"
                        />
                        <label className="text-sm cursor-pointer">
                          Thiết bị ngoài
                        </label>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Conditional Rendering based on deviceType */}
              {form.watch("deviceType") === "TamTin" ? (
                <FormField
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm font-medium">
                        Mã thiết bị
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Nhập hoặc quét mã thiết bị"
                            {...field}
                            className="bg-white"
                          />
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
              ) : (
                <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm font-medium">
                        Khách hàng
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl className="w-[70%]">
                          <Combobox
                            options={customers}
                            value={field.value}
                            onChange={field.onChange}
                            displayField="name"
                            placeholder="Chọn khách hàng"
                            searchPlaceholder="Tìm kiếm khách hàng..."
                            emptyMessage="Không tìm thấy khách hàng"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCustomerDialog(true)}
                          className="w-[30%] whitespace-nowrap"
                        >
                          + Thêm mới
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              )}

              {/* Repair Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Loại</FormLabel>
                    <div className="flex gap-4">
                      <div
                        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          field.value === "Sửa chữa"
                            ? "bg-blue-500 text-white shadow-lg"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => field.onChange("Sửa chữa")}
                      >
                        <input
                          type="radio"
                          {...field}
                          value="Sửa chữa"
                          checked={field.value === "Sửa chữa"}
                          className="w-4 h-4 mr-2 accent-white"
                        />
                        <label className="text-sm cursor-pointer">
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
                          {...field}
                          value="Bảo dưỡng"
                          checked={field.value === "Bảo dưỡng"}
                          className="w-4 h-4 mr-2 accent-white"
                        />
                        <label className="text-sm cursor-pointer">
                          Bảo dưỡng
                        </label>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Linh kiện List */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Danh sách linh kiện</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentList = form.getValues("linhKienList");
                      form.setValue("linhKienList", [
                        ...currentList,
                        {
                          _id: "",
                          name_linh_kien: null,
                          total: 1,
                        },
                      ]);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    + Thêm linh kiện
                  </Button>
                </div>

                {form.watch("linhKienList").map((_, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`linhKienList.${index}`}
                      render={({ field }) => (
                        <FormItem className="w-[67%]">
                          <FormControl>
                            <Combobox
                              options={linhKienOptions}
                              value={field.value}
                              onChange={(selected) => {
                                if (selected) {
                                  form.setValue(`linhKienList.${index}`, {
                                    _id: selected._id,
                                    name_linh_kien: selected.name_linh_kien,
                                    total: 1,
                                  });
                                }
                              }}
                              displayField="name_linh_kien"
                              placeholder="Chọn linh kiện"
                              searchPlaceholder="Tìm kiếm linh kiện..."
                              emptyMessage="Không tìm thấy linh kiện."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`linhKienList.${index}.total`}
                      render={({ field }) => (
                        <FormItem className="w-[20%]">
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                field.onChange(value);
                              }}
                              className="bg-white"
                            />
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
                      // Ẩn nút xóa khi chỉ có 1 row
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
                    <FormLabel className="text-sm font-medium">
                      Ghi chú
                    </FormLabel>
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
      <CustomerDialog
        open={showCustomerDialog}
        onClose={() => setShowCustomerDialog(false)}
        onSuccess={refreshCustomers}
      />
    </div>
  );
}
