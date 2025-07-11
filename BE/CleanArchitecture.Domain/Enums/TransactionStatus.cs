namespace CleanArchitecture.Domain.Enums;

public enum TransactionStatus
{
    Pending = 1,        // Chờ xử lý
    Completed = 2,      // Hoàn thành
    Failed = 3,         // Thất bại
    Cancelled = 4       // Đã hủy
}
