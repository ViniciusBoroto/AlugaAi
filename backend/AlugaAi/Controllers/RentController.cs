using Microsoft.AspNetCore.Mvc;

namespace AlugaAi.Controllers
{
    public class RentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
