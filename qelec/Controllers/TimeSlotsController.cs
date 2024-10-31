using Microsoft.AspNetCore.Mvc;
using qelec.Models; // Importuj istniejący model TimeSlot
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class TimeSlotsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TimeSlotsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("timeslots")]
    public IActionResult GetAvailableTimeSlots([FromQuery] DateTime date)
    {
        // Konwertuj datę na UTC (jeśli nie jest już w UTC) i porównaj tylko część daty (bez czasu)
        var utcDate = DateTime.SpecifyKind(date, DateTimeKind.Utc).Date;

        // Pobierz wszystkie sloty czasu dla tej daty (zarówno dostępne, jak i niedostępne) - tylko do celów testowych
        var availableSlots = _context.TimeSlot
            .Where(ts => ts.Date.Date == utcDate)
            .ToList();

        return Ok(new { availableSlots });
    }
}
