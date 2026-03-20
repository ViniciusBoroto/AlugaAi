using System;
using System.Threading.Tasks;
using AlugaAi.DTOs.InputModels;
using AlugaAi.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlugaAi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RenterController : ControllerBase
    {
        private readonly IRenterService _service;

        public RenterController(IRenterService service)
        {
            _service = service;
        }
        [HttpPost]
        public async Task<IActionResult> CreateRenter(CreateRenterInputModel request)
        {
            try
            {
                var renter = await _service.CreateRenterAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = renter.Id }, renter);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the renter.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var renters = await _service.GetAllAsync();
            return Ok(renters);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var renter = await _service.GetByIdAsync(id);

            if (renter is null)
            {
                return NotFound();
            }

            return Ok(renter);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateRenterInputModel request)
        {
            try
            {
                var renter = await _service.UpdateAsync(id, request);

                if (renter is null)
                {
                    return NotFound();
                }

                return Ok(renter);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the renter.");
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
