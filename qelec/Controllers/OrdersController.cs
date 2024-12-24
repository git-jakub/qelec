using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using qelec.Models.DTOs;
using qelec.Models;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(AppDbContext context, ILogger<OrdersController> logger)
    {
        _context = context;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        _logger.LogInformation($"Raw value of 'nameidentifier': {userIdClaim}");

        if (string.IsNullOrEmpty(userIdClaim))
        {
            return null;
        }

        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }

        _logger.LogError($"Failed to parse 'nameidentifier' claim to int. Value: {userIdClaim}");
        return null;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        var order = await _context.Orders
            .Include(o => o.JobDetails)
            .ThenInclude(jd => jd.JobAddress)
            .Include(o => o.EstimateDetails)
            .ThenInclude(e => e.CostBreakdown)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (order == null)
        {
            return NotFound();
        }

        var orderDto = MapToOrderDto(order);
        return Ok(orderDto);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateOrder([FromBody] OrderDto orderDto)
    {
        if (orderDto == null || orderDto.TimeSlotId == 0)
        {
            return BadRequest("Order data or TimeSlot ID is invalid.");
        }

        var timeSlot = await _context.TimeSlot.FindAsync(orderDto.TimeSlotId);
        if (timeSlot == null)
        {
            return BadRequest("Invalid TimeSlot ID.");
        }

        // Save JobAddress
        var jobAddress = new JobAddress
        {
            Postcode = orderDto.JobAddress.Postcode,
            Street = orderDto.JobAddress.Street,
            City = orderDto.JobAddress.City,
            PaidOnStreet = orderDto.JobAddress.PaidOnStreet,
            VisitorPermit = orderDto.JobAddress.VisitorPermit,
            CongestionCharge = orderDto.JobAddress.CongestionCharge
        };
        _context.JobAddress.Add(jobAddress);
        await _context.SaveChangesAsync();

        // Save JobDetails
        var jobDetails = new JobDetails
        {
            ClientName = orderDto.JobDetails.ClientName,
            SiteAccessInfo = orderDto.JobDetails.SiteAccessInfo,
            Mobile = orderDto.JobDetails.Mobile,
            ClientEmail = orderDto.JobDetails.ClientEmail,
            YourReference = orderDto.JobDetails.YourReference,
            AdditionalInfo = orderDto.JobDetails.AdditionalInfo,
            JobAddressId = jobAddress.JobAddressId // Link JobAddress to JobDetails
        };
        _context.JobDetails.Add(jobDetails);
        await _context.SaveChangesAsync();

        // Save InvoiceDetails
        var invoiceDetails = new InvoiceDetails
        {
            RecipientName = orderDto.InvoiceDetails.RecipientName,
            RecipientAddress = orderDto.InvoiceDetails.RecipientAddress,
            RecipientPostcode = orderDto.InvoiceDetails.RecipientPostcode,
            RecipientCity = orderDto.InvoiceDetails.RecipientCity,
            RecipientEmail = orderDto.InvoiceDetails.RecipientEmail,
            RecipientPhone = orderDto.InvoiceDetails.RecipientPhone,
            PaymentStatus = orderDto.InvoiceDetails.PaymentStatus,
            CompanyName = orderDto.InvoiceDetails.CompanyName
        };
        _context.InvoiceDetails.Add(invoiceDetails);
        await _context.SaveChangesAsync();

        // Save EstimateDetails
        var estimateDetails = new EstimateDetails
        {
            JobDescription = orderDto.EstimateDetails.JobDescription,
            GeneratedTime = orderDto.EstimateDetails.GeneratedTime,
            CalculatedCost = orderDto.EstimateDetails.CalculatedCost,
            PaidOnStreet = orderDto.EstimateDetails.PaidOnStreet,
            CongestionCharge = orderDto.EstimateDetails.CongestionCharge,
            Postcode = orderDto.EstimateDetails.Postcode,
            PostcodeTierCost = orderDto.EstimateDetails.PostcodeTierCost,
            MultiplierDetails = orderDto.EstimateDetails.MultiplierDetails != null ? new MultiplierDetails
            {
                Name = orderDto.EstimateDetails.MultiplierDetails.Name,
                Start = orderDto.EstimateDetails.MultiplierDetails.Start,
                End = orderDto.EstimateDetails.MultiplierDetails.End,
                Multiplier = orderDto.EstimateDetails.MultiplierDetails.Multiplier
            } : null,
            CostBreakdown = new CostBreakdown
            {
                LaborCost = orderDto.EstimateDetails.CostBreakdown.LaborCost,
                ParkingCost = orderDto.EstimateDetails.CostBreakdown.ParkingCost,
                TotalCongestionCharge = orderDto.EstimateDetails.CostBreakdown.TotalCongestionCharge,
                CommutingCost = orderDto.EstimateDetails.CostBreakdown.CommutingCost
            }
        };
        _context.EstimateDetails.Add(estimateDetails);
        await _context.SaveChangesAsync();

        // Create Order
        var userId = GetUserId();
        var order = new Order
        {
            TimeSlotId = orderDto.TimeSlotId,
            Status = orderDto.Status,
            CreatedDate = DateTime.UtcNow,
            UserId = userId,
            JobDetailsId = jobDetails.JobDetailsId,
            InvoiceDetailsId = invoiceDetails.InvoiceDetailsId,
            EstimateDetailsId = estimateDetails.EstimateDetailsId,
            JobAddressId = jobAddress.JobAddressId // Ensure JobAddressId is set in the Order
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, MapToOrderDto(order));
    }



    private OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            OrderId = order.OrderId,
            TimeSlotId = order.TimeSlotId ?? 0,
            Status = order.Status,
            CreatedDate = order.CreatedDate,
            UpdatedDate = order.UpdatedDate,
            UserId = order.UserId,
            JobDetails = new JobDetailsDto
            {
                ClientName = order.JobDetails.ClientName,
                SiteAccessInfo = order.JobDetails.SiteAccessInfo,
                Mobile = order.JobDetails.Mobile,
                ClientEmail = order.JobDetails.ClientEmail,
                YourReference = order.JobDetails.YourReference,
                AdditionalInfo = order.JobDetails.AdditionalInfo
            },
            JobAddress = new JobAddressDto
            {
                Postcode = order.JobDetails.JobAddress.Postcode,
                Street = order.JobDetails.JobAddress.Street,
                City = order.JobDetails.JobAddress.City,
                PaidOnStreet = order.JobDetails.JobAddress.PaidOnStreet,
                VisitorPermit = order.JobDetails.JobAddress.VisitorPermit,
                CongestionCharge = order.JobDetails.JobAddress.CongestionCharge
            },
            EstimateDetails = new EstimateDetailsDto
            {
                JobDescription = order.EstimateDetails.JobDescription,
                GeneratedTime = order.EstimateDetails.GeneratedTime,
                CalculatedCost = order.EstimateDetails.CalculatedCost,
                PaidOnStreet = order.EstimateDetails.PaidOnStreet,
                CongestionCharge = order.EstimateDetails.CongestionCharge,
                Postcode = order.EstimateDetails.Postcode,
                PostcodeTierCost = order.EstimateDetails.PostcodeTierCost,
                MultiplierDetails = order.EstimateDetails.MultiplierDetails != null ? new MultiplierDetailsDto
                {
                    Name = order.EstimateDetails.MultiplierDetails.Name,
                    Start = order.EstimateDetails.MultiplierDetails.Start,
                    End = order.EstimateDetails.MultiplierDetails.End,
                    Multiplier = order.EstimateDetails.MultiplierDetails.Multiplier
                } : null,
                CostBreakdown = new CostBreakdownDto
                {
                    LaborCost = order.EstimateDetails.CostBreakdown.LaborCost,
                    ParkingCost = order.EstimateDetails.CostBreakdown.ParkingCost,
                    TotalCongestionCharge = order.EstimateDetails.CostBreakdown.TotalCongestionCharge,
                    CommutingCost = order.EstimateDetails.CostBreakdown.CommutingCost
                }
            }
        };
    }
}
