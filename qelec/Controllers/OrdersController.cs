using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using qelec.Models.DTOs;
using qelec.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }
        return null;
    }

    [HttpGet("userid")]
    public IActionResult GetUserIdEndpoint()
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized("Invalid User ID in token.");
        }

        return Ok(new { UserId = userId });
    }

    private OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            OrderId = order.OrderId,
            TimeSlotId = order.TimeSlotId,
            Status = order.Status,
            CreatedDate = order.CreatedDate,
            UpdatedDate = order.UpdatedDate,
            StatusChangeHistory = order.StatusChangeHistory,
            UserId = order.UserId,
            JobDetails = order.JobDetails,
            InvoiceDetails = order.InvoiceDetails
        };
    }
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateOrder([FromBody] Order order)
    {
        Console.WriteLine($"Received TimeSlotId: {order.TimeSlotId}");

        if (order == null || order.TimeSlotId == 0)
        {
            return BadRequest("Order data or TimeSlot ID is invalid.");
        }

        // Verify TimeSlot exists
        var timeSlot = await _context.TimeSlot.FindAsync(order.TimeSlotId);
        if (timeSlot == null)
        {
            return BadRequest("Invalid TimeSlot ID.");
        }

        // Assign UserId if authenticated
        var userId = GetUserId();
        if (userId.HasValue)
        {
            var user = await _context.Users.FindAsync(userId.Value);
            if (user != null)
            {
                order.UserId = user.UserId;
                order.User = user;
            }
        }

        order.CreatedDate = DateTime.UtcNow;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var orderDto = MapToOrderDto(order);
        return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, orderDto);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        var order = await _context.Orders
            .Include(o => o.JobDetails)
            .Include(o => o.InvoiceDetails)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (order == null)
        {
            return NotFound();
        }

        var userId = GetUserId();
        if (userId != null && order.UserId != userId)
        {
            return Forbid();
        }

        var orderDto = MapToOrderDto(order);
        return Ok(orderDto);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized("Invalid User ID in token.");
        }

        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.JobDetails)
            .Include(o => o.InvoiceDetails)
            .ToListAsync();

        var orderDtos = orders.Select(MapToOrderDto).ToList();
        return Ok(orderDtos);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order updatedOrder)
    {
        if (id != updatedOrder.OrderId)
        {
            return BadRequest("Order ID mismatch.");
        }

        var existingOrder = await _context.Orders
            .Include(o => o.JobDetails)
            .Include(o => o.InvoiceDetails)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (existingOrder == null)
        {
            return NotFound();
        }

        var userId = GetUserId();
        if (userId != null && existingOrder.UserId != userId)
        {
            return Forbid();
        }

        existingOrder.TimeSlotId = updatedOrder.TimeSlotId;
        existingOrder.Status = updatedOrder.Status;
        existingOrder.UpdatedDate = DateTime.UtcNow;
        existingOrder.JobDetails = updatedOrder.JobDetails;
        existingOrder.InvoiceDetails = updatedOrder.InvoiceDetails;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Orders.Any(e => e.OrderId == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.JobDetails)
            .Include(o => o.InvoiceDetails)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (order == null)
        {
            return NotFound();
        }

        var userId = GetUserId();
        if (userId != null && order.UserId != userId)
        {
            return Forbid();
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
