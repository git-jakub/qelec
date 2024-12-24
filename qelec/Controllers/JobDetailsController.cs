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
    public async Task<IActionResult> CreateJobDetails([FromBody] JobDetailsDto jobDetailsDto)
    {
        if (jobDetailsDto == null)
        {
            return BadRequest("Invalid job details data.");
        }

        var jobDetails = new JobDetails
        {
            ClientName = jobDetailsDto.ClientName,
            SiteAccessInfo = jobDetailsDto.SiteAccessInfo,
            Mobile = jobDetailsDto.Mobile,
            ClientEmail = jobDetailsDto.ClientEmail,
            YourReference = jobDetailsDto.YourReference,
            AdditionalInfo = jobDetailsDto.AdditionalInfo
        };

        _context.JobDetails.Add(jobDetails);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetJobDetailsById), new { id = jobDetails.JobDetailsId }, jobDetails);
    }

    // GET: api/jobdetails/{id} - Gets specific JobDetails by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<JobDetailsDto>> GetJobDetailsById(int id)
    {
        var jobDetails = await _context.JobDetails
            .Include(j => j.JobAddress) // Include related JobAddress if necessary
            .FirstOrDefaultAsync(j => j.JobDetailsId == id);

        if (jobDetails == null)
        {
            return NotFound();
        }

        var jobDetailsDto = new JobDetailsDto
        {
            ClientName = jobDetails.ClientName,
            SiteAccessInfo = jobDetails.SiteAccessInfo,
            Mobile = jobDetails.Mobile,
            ClientEmail = jobDetails.ClientEmail,
            YourReference = jobDetails.YourReference,
            AdditionalInfo = jobDetails.AdditionalInfo
        };

        return Ok(jobDetailsDto);
    }

    // GET: api/jobdetails - Gets all JobDetails
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobDetailsDto>>> GetAllJobDetails()
    {
        var jobDetailsList = await _context.JobDetails.ToListAsync();

        var jobDetailsDtos = new List<JobDetailsDto>();
        foreach (var jobDetails in jobDetailsList)
        {
            jobDetailsDtos.Add(new JobDetailsDto
            {
                ClientName = jobDetails.ClientName,
                SiteAccessInfo = jobDetails.SiteAccessInfo,
                Mobile = jobDetails.Mobile,
                ClientEmail = jobDetails.ClientEmail,
                YourReference = jobDetails.YourReference,
                AdditionalInfo = jobDetails.AdditionalInfo
            });
        }

        return Ok(jobDetailsDtos);
    }

    // PUT: api/jobdetails/{id} - Updates an existing JobDetails
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateJobDetails(int id, [FromBody] JobDetailsDto updatedJobDetailsDto)
    {
        var existingJobDetails = await _context.JobDetails.FindAsync(id);
        if (existingJobDetails == null)
        {
            return NotFound();
        }

        // Update fields
        existingJobDetails.ClientName = updatedJobDetailsDto.ClientName;
        existingJobDetails.SiteAccessInfo = updatedJobDetailsDto.SiteAccessInfo;
        existingJobDetails.Mobile = updatedJobDetailsDto.Mobile;
        existingJobDetails.ClientEmail = updatedJobDetailsDto.ClientEmail;
        existingJobDetails.YourReference = updatedJobDetailsDto.YourReference;
        existingJobDetails.AdditionalInfo = updatedJobDetailsDto.AdditionalInfo;

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
