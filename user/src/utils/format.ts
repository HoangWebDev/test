// Định dạng số dư với dấu phân cách hàng nghìn và ký hiệu $
const formatBalance = (balance: number): string => {
    return `$${balance.toString().replace(/\./g, ',')}`;
};

// Định dạng ngày theo yêu cầu (yyyy-MM-dd)
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Định dạng ngày chi tiết cho tooltip
const formatDetailedDate = (date: Date): string => {
    return date.toLocaleString();
};


export { formatBalance, formatDate, formatDetailedDate };