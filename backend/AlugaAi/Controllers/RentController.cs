using AlugaAi.DTOs.InputModels;
using AlugaAi.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlugaAi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentController : ControllerBase
    {
        private readonly IRentService _service;

        public RentController(IRentService service)
        {
            _service = service;
        }
        [HttpPost("batch")]
        public async Task<IActionResult> CreateMany(IEnumerable<CreateRentInputModel> request)
        {
            try
            {
                var rents = await _service.CreateManyAsync(request);
                return Ok(rents);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the rents.");
            }
        }


        [HttpPost]
        public async Task<IActionResult> Create(CreateRentInputModel request)
        {
            try
            {
                var rent = await _service.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = rent.Id }, rent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the rent.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rents = await _service.GetAllAsync();
            return Ok(rents);
        }

        [HttpGet("store/{storeId:guid}")]
        public async Task<IActionResult> GetByStore(Guid storeId)
        {
            var rents = await _service.GetByStoreIdAsync(storeId);
            return Ok(rents);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var rent = await _service.GetByIdAsync(id);
            if (rent is null)
            {
                return NotFound();
            }
            return Ok(rent);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateRentInputModel request)
        {
            try
            {
                var rent = await _service.UpdateAsync(id, request);
                if (rent is null)
                {
                    return NotFound();
                }
                return Ok(rent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the rent.");
            }
        }

        [HttpPatch("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, UpdateRentStatusInputModel request)
        {
            try
            {
                var rent = await _service.UpdateStatusAsync(id, request);
                if (rent is null)
                {
                    return NotFound();
                }

                return Ok(rent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(500, ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the rent status.");
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
