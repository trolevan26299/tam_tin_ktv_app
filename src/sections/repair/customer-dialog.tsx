import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { formatDateTime } from "@/utils/format-datetime";

interface CustomerFormValues {
  name: string;
  address: string;
  phone: string;
  type: string;
  email: string;
  note: string;
  regDt: string;
}

interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CustomerDialog({ open, onClose, onSuccess }: CustomerDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CustomerFormValues>({
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      type: "private",
      email: "",
      note: "",
      regDt: formatDateTime(),
    },
  });

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      await axios.post("/api/customers/add-new", values, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      toast({
        title: "Thành công",
        description: "Thêm khách hàng mới thành công",
      });
      
      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm khách hàng mới",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    form.clearErrors();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[90vw] py-6 px-3  rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Thêm khách hàng mới
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Tên khách hàng là bắt buộc" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Tên khách hàng *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-colors"
                        placeholder="Nhập tên khách hàng"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel" 
                        className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-colors"
                        placeholder="Nhập số điện thoại"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              rules={{ required: "Địa chỉ là bắt buộc" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Địa chỉ *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-colors"
                      placeholder="Nhập địa chỉ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email" 
                      className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-colors"
                      placeholder="Nhập email"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-colors resize-none min-h-[100px]"
                      placeholder="Nhập ghi chú"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-1 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 bg-white hover:bg-gray-100 transition-colors"
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-200 transform hover:scale-105"
              >
                {loading ? "Đang thêm..." : "Thêm khách hàng"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}