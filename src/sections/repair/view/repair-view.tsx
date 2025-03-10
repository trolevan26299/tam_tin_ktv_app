"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QrCode } from "lucide-react";
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
import { LinhKienDialog } from "@/sections/repair/linh-kien-dialog";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import {
  ICustomer,
  ILinhKienItem,
  RepairFormValues,
  IDeviceRepair,
} from "@/types/customer.type";
import { CustomerDialog } from "../customer-dialog";
import {
  formatDateTime,
  formatDateTimeTransaction,
} from "@/utils/format-datetime";
import { formatCurrency } from "@/utils/format-money";
import { parseCurrency } from "@/utils/format-money";

export function RepairView() {
  const [loading, setLoading] = useState(true);
  const [linhKienOptions, setLinhKienOptions] = useState<ILinhKienItem[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [deviceList, setDeviceList] = useState<IDeviceRepair[]>([
    { deviceId: "", linhKienList: [] },
  ]);
  const [showLinhKienDialog, setShowLinhKienDialog] = useState(false);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number>(-1);

  const router = useRouter();

  const form = useForm<RepairFormValues>({
    defaultValues: {
      deviceType: "TamTin",
      deviceId: "",
      customer: null,
      type: "Sửa chữa",
      linhKienList: [{ _id: "", name_linh_kien: null, total: 1 }],
      note: "",
      tongTien: "",
    },
    mode: "onChange",
    resolver: (values) => {
      const errors: any = {};

      if (values.deviceType === "Outside" && !values.customer) {
        errors.customer = {
          type: "required",
          message: "Vui lòng chọn khách hàng",
        };
      }

      if (
        values.deviceType === "Outside" &&
        values.type === "Sửa chữa" &&
        !values.tongTien
      ) {
        errors.tongTien = {
          type: "required",
          message: "Vui lòng nhập tổng tiền",
        };
      }

      if (!values.type) {
        errors.type = {
          type: "required",
          message: "Vui lòng chọn loại",
        };
      }

      if (values.deviceType === "Outside" && !values.linhKienList.length) {
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

  const validateTamTinDevices = () => {
    // Kiểm tra có thiết bị nào không
    if (deviceList.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng thêm ít nhất một thiết bị",
        variant: "destructive",
      });
      return false;
    }

    // Kiểm tra từng thiết bị
    for (const device of deviceList) {
      if (!device.deviceId) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập mã thiết bị cho tất cả các thiết bị",
          variant: "destructive",
        });
        return false;
      }
      if (device.linhKienList.length === 0) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn linh kiện cho tất cả các thiết bị",
          variant: "destructive",
        });
        return false;
      }
    }

    // Kiểm tra tổng tiền nếu là sửa chữa
    if (form.watch("type") === "Sửa chữa" && !form.watch("tongTien")) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tổng tiền",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const onSubmit = async (values: RepairFormValues) => {
    const authToken = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const currentDate = formatDateTimeTransaction(new Date());

    try {
      setLoading(true);

      if (values.deviceType === "TamTin") {
        // Kiểm tra hợp lệ cho thiết bị Tâm Tín
        if (!validateTamTinDevices()) {
          setLoading(false);
          return;
        }

        // Tạo danh sách tất cả linh kiện để tạo đơn hàng
        const allLinhKien = deviceList.flatMap((device) => device.linhKienList);
        let totalCost = 0;

        // Tính tổng chi phí
        allLinhKien.forEach((item) => {
          const linhKien = linhKienOptions.find((lk) => lk._id === item._id);
          if (linhKien) {
            totalCost += (linhKien.price || 0) * item.total;
          }
        });

        // Tạo lịch sử sửa chữa cho từng thiết bị
        for (const device of deviceList) {
          const repairPayload = {
            id_device: device.deviceId,
            type_repair: values.type,
            date_repair: new Date().toISOString().split("T")[0],
            linh_kien: device.linhKienList.map((item) => ({
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

          await axios.post("/api/device/repair", repairPayload, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }

        // Nếu là sửa chữa, tạo đơn hàng linh kiện tổng
        if (values.type === "Sửa chữa") {
          const deviceInfo = await axios.get(`/api/device/${deviceList[0].deviceId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const totalPrice = Number(values.tongTien || 0);

          const orderPayload = {
            chi_tiet_linh_kien: allLinhKien.map((item) => ({
              id_linh_kien: item._id,
              so_luong: item.total,
              price:
                linhKienOptions.find((lk) => lk._id === item._id)?.price || 0,
            })),
            name_customer: deviceInfo.data.name_customer,
            ghi_chu: "Sửa chữa Máy Tâm Tín",
            tong_tien: totalPrice,
            loi_nhuan: totalPrice - totalCost,
            ngay_tao: new Date().toISOString(),
          };

          await axios.post("/api/linhKien/order-linh-kien", orderPayload, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }

        // Tạo transactions cho từng linh kiện
        for (const item of allLinhKien) {
          const transactionPayload = {
            name_linh_kien: item.name_linh_kien,
            date_update: currentDate,
            type: values.type,
            nhan_vien: {
              name: userData.name || "",
              id: userData.id,
            },
            nguoi_tao: userData.name || "",
            noi_dung: values.note || "",
            total: item.total,
            create_date: currentDate,
            device_type: "Tâm Tín",
          };

          await axios.post("/api/transactions/linhkien", transactionPayload, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }

        toast({
          title: "Cập nhật thành công!",
          description: "Cập nhật sửa chữa thành công!",
          variant: "default",
        });
        router.push("/");
      } else {
        // Xử lý cho thiết bị ngoài (giữ nguyên logic cũ)
        const endpoint = "/api/customers/repair";
        const repairPayload = {
          customer_id: values.customer?._id,
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

        const response = await axios.post(endpoint, repairPayload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        // Nếu là thiết bị ngoài và type là sửa chữa, tạo đơn hàng linh kiện
        if (values.type === "Sửa chữa") {
          let totalCost = 0;

          // Tính tổng giá vốn từ các linh kiện
          values.linhKienList.forEach((item) => {
            const linhKien = linhKienOptions.find((lk) => lk._id === item._id);
            if (linhKien) {
              totalCost += (linhKien.price || 0) * (item?.total || 0);
            }
          });

          // Payload cho đơn hàng linh kiện
          const orderPayload = {
            chi_tiet_linh_kien: values.linhKienList.map((item) => ({
              id_linh_kien: item._id,
              so_luong: item.total,
              price:
                linhKienOptions.find((lk) => lk._id === item._id)?.price || 0,
            })),
            id_khach_hang: values.customer?._id,
            ghi_chu: "Sửa chữa KH ngoài",
            tong_tien: Number(values.tongTien || 0),
            loi_nhuan: Number(values.tongTien || 0) - totalCost,
            ngay_tao: new Date().toISOString(),
          };

          // Gọi API tạo đơn hàng linh kiện
          await axios.post("/api/linhKien/order-linh-kien", orderPayload, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }

        // Tạo Transaction Linh Kiện
        for (const item of values.linhKienList) {
          const transactionPayload = {
            name_linh_kien: item.name_linh_kien,
            date_update: currentDate,
            type: values.type,
            nhan_vien: {
              name: userData.name || "",
              id: userData.id,
            },
            nguoi_tao: userData.name || "",
            noi_dung: values.note || "",
            total: item.total,
            create_date: currentDate,
            device_type: "Khách hàng",
          };

          await axios.post("/api/transactions/linhkien", transactionPayload, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }

        if (response.status === 200) {
          toast({
            title: "Cập nhật thành công!",
            description: "Cập nhật sửa chữa thành công!",
            variant: "default",
          });
          router.push("/");
        }
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

              {/* Conditional Rendering based on deviceType */}
              {form.watch("deviceType") === "TamTin" ? (
                <>
                  {/* Danh sách thiết bị Tâm Tín */}
                  <div className="space-y-4">
                    {deviceList.map((device, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg space-y-3"
                      >
                        <div className="flex items-center gap-1">
                          <div className="flex-1">
                            <Input
                              value={device.deviceId}
                              onChange={(e) => {
                                const newList = [...deviceList];
                                newList[index].deviceId = e.target.value;
                                setDeviceList(newList);
                              }}
                              className="bg-white"
                              placeholder="Nhập mã thiết bị"
                            />
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCurrentDeviceIndex(index);
                              setShowScanner(true);
                            }}
                            size="icon"
                            className="w-12 h-10 hover:bg-primary hover:text-white transition-colors duration-200"
                          >
                            <QrCode className="h-6 w-6" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCurrentDeviceIndex(index);
                              setShowLinhKienDialog(true);
                            }}
                            className="whitespace-nowrap"
                          >
                            Linh kiện
                          </Button>
                          {deviceList.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => {
                                setDeviceList(
                                  deviceList.filter((_, i) => i !== index)
                                );
                              }}
                            >
                              -
                            </Button>
                          )}
                        </div>

                        {device.linhKienList.length > 0 && (
                          <div className="text-sm space-y-1 bg-white p-3 py-1 rounded">
                            {device.linhKienList.map((lk, lkIndex) => (
                              <div
                                key={lkIndex}
                                className="flex justify-between items-center"
                              >
                                <span>{lk.name_linh_kien}</span>
                                <span className="text-gray-600">
                                  SL: {lk.total}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDeviceList([
                          ...deviceList,
                          { deviceId: "", linhKienList: [] },
                        ]);
                      }}
                      className="w-full"
                    >
                      + Thêm thiết bị
                    </Button>
                  </div>

                  {/* Tổng tiền chung cho sửa chữa */}
                  {form.watch("type") === "Sửa chữa" && (
                    <FormField
                      control={form.control}
                      name="tongTien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Tổng tiền
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                field.value ? formatCurrency(field.value) : ""
                              }
                              onChange={(e) => {
                                const rawValue = parseCurrency(e.target.value);
                                field.onChange(rawValue);
                              }}
                              className="bg-white"
                              placeholder="Nhập tổng tiền"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </>
              ) : (
                <>
                  {/* UI cho thiết bị ngoài */}
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

                  {/* Linh kiện List cho thiết bị ngoài */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        Danh sách linh kiện
                      </h3>
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
                                      // Lấy giá trị total hiện tại
                                      const currentTotal =
                                        form.getValues(
                                          `linhKienList.${index}.total`
                                        ) || 1;
                                      form.setValue(`linhKienList.${index}`, {
                                        _id: selected._id,
                                        name_linh_kien: selected.name_linh_kien,
                                        total: currentTotal, // Giữ nguyên giá trị total đã nhập
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
                                  {...field}
                                  onChange={(e) => {
                                    const value =
                                      e.target.value === ""
                                        ? ""
                                        : parseInt(e.target.value);
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
                          disabled={form.watch("linhKienList").length <= 1}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Tổng tiền cho thiết bị ngoài */}
                  {form.watch("type") === "Sửa chữa" && (
                    <FormField
                      control={form.control}
                      name="tongTien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Tổng tiền
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                field.value ? formatCurrency(field.value) : ""
                              }
                              onChange={(e) => {
                                const rawValue = parseCurrency(e.target.value);
                                field.onChange(rawValue);
                              }}
                              className="bg-white"
                              placeholder="Nhập tổng tiền"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}

              {/* Note Field */}
              {form.watch("deviceType") !== "TamTin" && (
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
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                disabled={
                  form.watch("deviceType") === "Outside" &&
                  !form.formState.isValid
                }
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

        {/* Dialog chọn linh kiện */}
        <LinhKienDialog
          open={showLinhKienDialog}
          onClose={() => setShowLinhKienDialog(false)}
          linhKienOptions={linhKienOptions}
          initialSelected={
            currentDeviceIndex >= 0
              ? deviceList[currentDeviceIndex].linhKienList.map((item) => ({
                  ...item,
                  name_linh_kien: item.name_linh_kien || "", // Chuyển null thành chuỗi rỗng
                }))
              : []
          }
          onSave={(selectedItems) => {
            if (currentDeviceIndex >= 0) {
              const newList = [...deviceList];
              newList[currentDeviceIndex].linhKienList = selectedItems;
              setDeviceList(newList);
            }
          }}
        />

        {/* Dialog quét QR */}
        {showScanner && (
          <QrScannerDialog
            onResult={(result) => {
              if (
                form.watch("deviceType") === "TamTin" &&
                currentDeviceIndex >= 0
              ) {
                const newList = [...deviceList];
                newList[currentDeviceIndex].deviceId = result;
                setDeviceList(newList);
              } else {
                form.setValue("deviceId", result);
              }
              setShowScanner(false);
            }}
            onClose={() => setShowScanner(false)}
          />
        )}

        {/* Dialog thêm khách hàng */}
        <CustomerDialog
          open={showCustomerDialog}
          onClose={() => setShowCustomerDialog(false)}
          onSuccess={refreshCustomers}
        />
      </div>
    </div>
  );
}
