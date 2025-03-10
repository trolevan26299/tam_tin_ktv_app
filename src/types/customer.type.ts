export type  ILinhKienItem = {
    _id: string;
    name_linh_kien: string | null;
    total?: number;
    price?: number;
  };

export type ICustomer = {
    _id: string;
    name: string;
    address: string;
    phone: string;
    type: string;
    email: string;
    note: string;
    regDt: string;
  };
  export interface IDeviceRepair {
    deviceId: string;
    linhKienList: Array<{
      _id: string;
      name_linh_kien: string | null;
      total: number;
    }>;
  }

export type RepairFormValues = {
    deviceType: "TamTin" | "Outside";
    deviceId: string;
    customer: ICustomer | null;
    type: "Sửa chữa" | "Bảo dưỡng";
    linhKienList: Array<{
      _id: string;
      name_linh_kien: string | null;
      total: number;
    }>;
    tongTien?: string;
    note?: string;
  };
  