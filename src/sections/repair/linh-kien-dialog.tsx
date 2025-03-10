import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { ILinhKienItem } from "@/types/customer.type";
import { Search, Loader2 } from "lucide-react"; // Thêm icons

interface LinhKienDialogProps {
  open: boolean;
  onClose: () => void;
  linhKienOptions: ILinhKienItem[];
  onSave: (
    selectedItems: Array<{ _id: string; name_linh_kien: string; total: number }>
  ) => void;
  initialSelected?: Array<{
    _id: string;
    name_linh_kien: string;
    total: number;
  }>;
}

export function LinhKienDialog({
  open,
  onClose,
  linhKienOptions,
  onSave,
  initialSelected = [],
}: LinhKienDialogProps) {
  const [selected, setSelected] = useState<
    Array<{ item: ILinhKienItem; total: number }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(
        initialSelected
          .map((s) => ({
            item: linhKienOptions.find((l) => l._id === s._id) as ILinhKienItem,
            total: s.total,
          }))
          .filter((s) => s.item)
      );
      setSearchQuery(""); // Reset search khi mở dialog
    }
  }, [open, initialSelected, linhKienOptions]);

  // Lọc danh sách linh kiện theo search query
  const filteredOptions = useMemo(() => {
    return linhKienOptions.filter((item) =>
      item.name_linh_kien?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [linhKienOptions, searchQuery]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Sửa lại cấu trúc dữ liệu trả về cho khớp với type
      const formattedSelected = selected.map((s) => ({
        _id: s.item._id,
        name_linh_kien: s.item.name_linh_kien || "",
        total: s.total,
      }));
      onSave(formattedSelected);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[93%] h-[80vh] rounded-lg px-2">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary mb-4">
            Chọn linh kiện
          </DialogTitle>
        </DialogHeader>

        {/* Search Section */}
        <div className="sticky top-0 z-10 bg-white pb-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm linh kiện..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
            <span>Tổng: {filteredOptions.length} linh kiện</span>
            <span>Đã chọn: {selected.length} linh kiện</span>
          </div>
        </div>

        {/* Danh sách linh kiện */}
        <div className="space-y-2 max-h-[60vh] overflow-auto p-2 rounded-lg border bg-gray-50">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item) => (
              <div
                key={item._id}
                className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Checkbox
                  checked={selected.some((s) => s.item._id === item._id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelected([...selected, { item, total: 1 }]);
                    } else {
                      setSelected(
                        selected.filter((s) => s.item._id !== item._id)
                      );
                    }
                  }}
                  className="h-5 w-5"
                />
                <div className="flex-1">
                  <div className="font-medium text-[12px]">
                    {item.name_linh_kien}
                  </div>
                </div>
                {selected.some((s) => s.item._id === item._id) && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-500">SL:</label>
                    <Input
                      type="number"
                      className="w-16 text-center"
                      min="1"
                      value={
                        selected.find((s) => s.item._id === item._id)?.total ||
                        ""
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? 0 : parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setSelected(
                            selected.map((s) =>
                              s.item._id === item._id
                                ? { ...s, total: value }
                                : s
                            )
                          );
                        }
                      }}
                      onFocus={(e) => e.target.select()} // Tự động chọn toàn bộ text khi focus
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? "Không tìm thấy linh kiện phù hợp"
                : "Không có linh kiện nào"}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleSave} className="px-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              `Xác nhận (${selected.length})`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
