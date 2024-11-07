using Microsoft.AspNetCore.Mvc;
using qelec.Models.DTOs;
using qelec.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class JobDetailsController : ControllerBase
{
    private readonly AppDbContext _context;

    public JobDetailsController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/jobdetails - Adds new JobDetails
    [HttpPost]
    public async Task<IActionResult> CreateJobDetails([FromBody] JobDetails jobDetails)
    {
        if (jobDetails == null)
        {
            return BadRequest("Invalid job details data.");
        }

        _context.JobDetails.Add(jobDetails);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetJobDetailsById), new { id = jobDetails.JobDetailsId }, jobDetails);
    }

    // GET: api/jobdetails/{id} - Gets specific JobDetails by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<JobDetails>> GetJobDetailsById(int id)
    {
        var jobDetails = await _context.JobDetails.FindAsync(id);

        if (jobDetails == null)
        {
            return NotFound();
        }

        return Ok(jobDetails);
    }

    // GET: api/jobdetails - Gets all JobDetails
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobDetails>>> GetAllJobDetails()
    {
        var jobDetailsList = await _context.JobDetails.ToListAsync();
        return Ok(jobDetailsList);
    }

    // PUT: api/jobdetails/{id} - Updates an existing JobDetails
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJobDetails(int id, [FromBody] JobDetails updatedJobDetails)
    {
        if (id != updatedJobDetails.JobDetailsId)
        {
            return BadRequest("Job Details ID mismatch.");
        }

        var existingJobDetails = await _context.JobDetails.FindAsync(id);
        if (existingJobDetails == null)
        {
            return NotFound();
        }

        // Update fields
        existingJobDetails.Postcode = updatedJobDetails.Postcode;
        existingJobDetails.City = updatedJobDetails.City;
        existingJobDetails.Address = updatedJobDetails.Address;
        existingJobDetails.ClientName = updatedJobDetails.ClientName;
        existingJobDetails.SiteAccessInfo = updatedJobDetails.SiteAccessInfo;
        existingJobDetails.Mobile = updatedJobDetails.Mobile;
        existingJobDetails.ClientEmail = updatedJobDetails.ClientEmail;
        existingJobDetails.ServiceType = updatedJobDetails.ServiceType;
        existingJobDetails.ServiceDetails = updatedJobDetails.ServiceDetails;
        existingJobDetails.PropertySizeOrSpecification = updatedJobDetails.PropertySizeOrSpecification;
        existingJobDetails.EstimatedCost = updatedJobDetails.EstimatedCost;
        existingJobDetails.EstimatedCompletionTime = updatedJobDetails.EstimatedCompletionTime;
        existingJobDetails.ActualCompletionTime = updatedJobDetails.ActualCompletionTime;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/jobdetails/{id} - Deletes JobDetails
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJobDetails(int id)
    {
        var jobDetails = await _context.JobDetails.FindAsync(id);
        if (jobDetails == null)
        {
            return NotFound();
        }

        _context.JobDetails.Remove(jobDetails);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
