using System;
using System.Collections.Generic;
using System.Linq;
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
                var renter = _service.CreateRenter(request);
                return Ok(renter);
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
    }
}