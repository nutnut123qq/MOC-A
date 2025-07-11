using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.DTOs;

public class UpdatePaymentStatusDto
{
    public PaymentStatus PaymentStatus { get; set; }
}
