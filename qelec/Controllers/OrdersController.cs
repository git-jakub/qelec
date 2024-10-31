using Microsoft.AspNetCore.Mvc;
using qelec.Models;  // Importuj model Order
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

    // POST: api/orders - Dodaje nowe zamówienie
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] Order order)
    {
        if (order == null)
        {
            return BadRequest("Invalid order data.");
        }

        // Dodaj zamówienie do kontekstu bazy danych
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Zwróć utworzone zamówienie wraz z jego ID
        return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, order);
    }

    // GET: api/orders/{id} - Pobiera konkretne zamówienie po ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrderById(int id)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    // GET: api/orders - Pobiera wszystkie zamówienia
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
    {
        return await _context.Orders.ToListAsync();
    }

    // PUT: api/orders/{id} - Aktualizuje zamówienie
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
    {
        if (id != order.OrderId)
        {
            return BadRequest("Order ID mismatch.");
        }

        _context.Entry(order).State = EntityState.Modified;

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

    // DELETE: api/orders/{id} - Usuwa zamówienie
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound();
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
