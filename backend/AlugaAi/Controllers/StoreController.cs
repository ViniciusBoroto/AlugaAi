using System;
using System.Threading.Tasks;
using AlugaAi.DTOs.InputModels;
using AlugaAi.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlugaAi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoreController : ControllerBase
    {
        private readonly IStoreService _service;

        public StoreController(IStoreService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateStore(CreateStoreInputModel request)
        {
            try
            {
                var store = await _service.CreateStoreAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = store.Id }, store);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the store.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var stores = await _service.GetAllAsync();
            return Ok(stores);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var store = await _service.GetByIdAsync(id);

            if (store is null)
                return NotFound();

            return Ok(store);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateStoreInputModel request)
        {
            try
            {
                var store = await _service.UpdateAsync(id, request);

                if (store is null)
                    return NotFound();

                return Ok(store);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the store.");
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}