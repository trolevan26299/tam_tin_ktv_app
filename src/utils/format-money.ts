export const formatCurrency = (amount: number | string): string => {
    const numberAmount = Number(amount);
    if (isNaN(numberAmount)) return '0đ';
    return numberAmount.toLocaleString('vi-VN') ;
  };
  
  export const parseCurrency = (formattedAmount: string): string => {
    return formattedAmount.replace(/[^\d]/g, '');
  };