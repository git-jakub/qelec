using Microsoft.AspNetCore.Mvc;
using qelec.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TimeSlotsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TimeSlotsController(AppDbContext context)
    {
        _context = context;
    }

    // Endpoint to get available time slots for a specific date
    [HttpGet("timeslots")]
    public IActionResult GetAvailableTimeSlots([FromQuery] DateTime date)
    {
        var utcDate = DateTime.SpecifyKind(date, DateTimeKind.Utc).Date;

        // Filter time slots that fall within the specified date and are available
        var availableSlots = _context.TimeSlot
            .Where(ts => ts.StartDate.Date == utcDate && ts.IsAvailable)
            .ToList();

        return Ok(new { availableSlots });
    }

    // Endpoint to create time slots in bulk
    [HttpPost("bulk")]
    public async Task<IActionResult> CreateTimeSlotsForRange([FromBody] TimeSlot timeSlotRange)
    {
        try
        {
            if (timeSlotRange == null || timeSlotRange.StartDate == DateTime.MinValue || timeSlotRange.EndDate == DateTime.MinValue)
            {
                return BadRequest("Start date and end date are required.");
            }

            var timeSlotsToAdd = new List<TimeSlot>();
            DateTime currentDate = timeSlotRange.StartDate.Date;
            DateTime endDate = timeSlotRange.EndDate.Date;
            TimeSpan slotDuration = TimeSpan.FromHours(1); // Adjust slot duration if needed

            while (currentDate <= endDate)
            {
                DateTime dayStartTime = currentDate.Add(timeSlotRange.StartDate.TimeOfDay);
                DateTime dayEndTime = currentDate.Add(timeSlotRange.EndDate.TimeOfDay);

                for (var slotTime = dayStartTime; slotTime < dayEndTime; slotTime = slotTime.Add(slotDuration))
                {
                    timeSlotsToAdd.Add(new TimeSlot
                    {
                        StartDate = slotTime,
                        EndDate = slotTime.Add(slotDuration),
                        IsAvailable = timeSlotRange.IsAvailable
                    });
                }

                currentDate = currentDate.AddDays(1);
            }

            await _context.TimeSlot.AddRangeAsync(timeSlotsToAdd);
            var saveResult = await _context.SaveChangesAsync();

            if (saveResult > 0)
            {
                return Ok(new { message = "Time slots created successfully.", recordsSaved = saveResult });
            }
            else
            {
                return StatusCode(500, "Failed to save time slots to the database.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            return StatusCode(500, "An error occurred while creating time slots.");
        }
    }

    // New endpoint to mark time slots as unavailable after booking
    [HttpPost("mark-unavailable")]
    public async Task<IActionResult> MarkTimeSlotsUnavailable([FromBody] BookingRequest bookingRequest)
    {
        if (bookingRequest == null || bookingRequest.StartDate == DateTime.MinValue || bookingRequest.EndDate == DateTime.MinValue)
        {
            return BadRequest("Start date and end date are required.");
        }

        try
        {
            var slotsToUpdate = _context.TimeSlot
                .Where(ts => ts.StartDate >= bookingRequest.StartDate && ts.EndDate <= bookingRequest.EndDate && ts.IsAvailable)
                .ToList();

            foreach (var slot in slotsToUpdate)
            {
                slot.IsAvailable = false;
            }

            var updateResult = await _context.SaveChangesAsync();

            if (updateResult > 0)
            {
                return Ok(new { message = "Time slots marked as unavailable successfully.", recordsUpdated = updateResult });
            }
            else
            {
                return StatusCode(500, "Failed to update time slots.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            return StatusCode(500, "An error occurred while marking time slots as unavailable.");
        }
    }
}

// Define a BookingRequest class to receive booking details for marking slots as unavailable
public class BookingRequest
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
