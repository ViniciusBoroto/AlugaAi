using AlugaAi.DTOs.InputModels;
using AlugaAi.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlugaAi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _service;

        public ReviewController(IReviewService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateReviewInputModel request)
        {
            try
            {
                var review = await _service.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = review.Id }, review);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the review.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reviews = await _service.GetAllAsync();
            return Ok(reviews);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var review = await _service.GetByIdAsync(id);
            if (review is null)
            {
                return NotFound();
            }
            return Ok(review);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateReviewInputModel request)
        {
            try
            {
                var review = await _service.UpdateAsync(id, request);
                if (review is null)
                {
                    return NotFound();
                }
                return Ok(review);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the review.");
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}