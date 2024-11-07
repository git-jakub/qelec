using Microsoft.AspNetCore.Mvc;
using qelec.Models;
using qelec.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/orders - Adds a new order with JobDetails and InvoiceDetails
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] Order order)
    {
        if (order == null)
        {
            return BadRequest("Invalid order data.");
        }

        // Set CreatedDate for the new order
        order.CreatedDate = DateTime.UtcNow;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, order);
    }

    // GET: api/orders/{id} - Gets a specific order by ID, including JobDetails and InvoiceDetails
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrderById(int id)
    {
        var order = await _context.Orders
            .Include(o => o.JobDetails)
            .Include(o => o.InvoiceDetails)
            .FirstOrDefaultAsync(o => o.OrderId == id);

        if (order == null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    // GET: api/orders - Gets all orders, including JobDetails and InvoiceDetails
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.JobDetails)
            .Include(o => o.InvoiceDetails)
            .ToListAsync();

        return Ok(orders);
    }

    // PUT: api/orders/{id} - Updates an existing order
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

        // Update fields
        existingOrder.TimeSlotId = updatedOrder.TimeSlotId;
        existingOrder.Status = updatedOrder.Status;
        existingOrder.UpdatedDate = DateTime.UtcNow;  // Set UpdatedDate to the current time

        // Update JobDetails and InvoiceDetails as needed
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

    // DELETE: api/orders/{id} - Deletes an order and its related details
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

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
