"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/sections/repair/combobox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  history_repair: RepairHistory[];
}

interface RepairHistory {
  _id: string;
  date_repair: string;
  type_repair: string;
  linh_kien: {
    id: string;
    name: string;
    total: number;
  }[];
  staff_repair: string;
  note: string;
}

interface FormValues {
  customer: Customer | null;
}

export default function CheckDeviceView() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      customer: null,
    },
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.get("/api/customers", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách khách hàng:", error);
      }
    };

    fetchCustomers();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const selectedCustomer = form.watch("customer");

  return (
    <div className="container mx-auto p-6 h-[100vh]">
      <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Kiểm tra thiết bị khách hàng
      </h1>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg flex flex-col h-[80vh] ">
      <div className="flex-none">
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Khách hàng
                  </FormLabel>
                  <FormControl>
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
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="flex-1 overflow-y-auto mt-4">
        {selectedCustomer?.history_repair &&
        selectedCustomer.history_repair.length > 0 ? (
          <div className="mt-3 space-y-2 h-[100%] overflow-y-auto">
            {selectedCustomer.history_repair.map((history) => (
              <div
                key={history._id}
                className="bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-md 
        rounded-xl p-2 shadow-lg hover:shadow-xl transition-all duration-300
        border border-gray-100"
              >
               
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">
                      {formatDate(history.date_repair)}
                    </span>
                  </div>
                  <div
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 
            text-white rounded-full text-sm font-medium shadow-sm"
                  >
                    {history.staff_repair}
                  </div>
                </div>

                {/* Loại sửa chữa */}
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-500">Loại:</span>
                    </div>
                    <span className="text-gray-900 font-medium text-sm">{history.type_repair}</span>
                  </div>
                </div>

                {/* Linh kiện */}
                <div className="mb-2">
                  <div className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Linh kiện sử dụng :
                  </div>
                  <div className=" gap-3 w-full">
                    {history.linh_kien.map((lk, index) => (
                       <div
                       key={index}
                       className="bg-white/60 px-4 py-3 rounded-lg text-sm border border-gray-100
               hover:bg-white/80 transition-colors duration-200 w-full"
                     >
                       <div className="flex items-center justify-between">
                         <div className="font-medium text-gray-800">
                           {lk.name}
                         </div>
                         <div className="text-blue-600 font-medium">
                            {lk.total}
                         </div>
                       </div>
                     </div>
                    ))}
                  </div>
                </div>

                {/* Ghi chú */}
                {history.note && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Ghi chú :
                    </div>
                    <div className="bg-white/60 p-4 rounded-lg text-gray-700 text-sm border border-gray-100 pl-6">
                      {history.note}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : selectedCustomer ? (
          <div className="text-center py-8 mt-6 bg-white/50 backdrop-blur-sm rounded-xl h-[100%] overflow-y-auto">
            <div className="text-gray-500 font-medium">
              Khách hàng này chưa có lịch sử sửa chữa.
            </div>
          </div>
        ) : (
          <div className="text-center py-4 mt-6 h-[80%] overflow-y-auto">Vui lòng chọn khách hàng</div>
        )}
      </div>
      </div>
      <div className="mt-3 flex justify-center w-full">
          <a
            href="/"
            className="w-full justify-center  group relative inline-flex items-center px-8 py-3 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ease-out group-hover:w-full"></span>
            <span className="relative flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Về Trang Chủ
            </span>
          </a>
        </div>
    </div>
  );
}
