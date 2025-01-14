interface ComponentRepair {
    id: string;
    name: string;
    total: number;
  }
  
  // Type cho lịch sử sửa chữa
  interface HistoryRepair {
    type_repair: string;    // sửa chữa hay bảo hành
    date_repair: string;    // ngày sửa chữa
    linh_kien?: ComponentRepair[];  // linh kiện sửa chữa
    staff_repair?: string;  // nhân viên sửa chữa
    note?: string;         // ghi chú
  }
  
  // Type chính cho Device
  export interface Device {
    name: string;           // tên thiết bị
    id_device: string;      // mã thiết bị
    status: string;         // trạng thái
    type_customer?: string; // loại khách hàng (cá nhân/ngân hàng)
    name_customer?: string; // tên khách hàng
    history_repair?: HistoryRepair[]; // lịch sử sửa chữa
    createdAt?: Date;       // ngày tạo (tự động từ MongoDB)
    updatedAt?: Date;       // ngày cập nhật (tự động từ MongoDB)
  }