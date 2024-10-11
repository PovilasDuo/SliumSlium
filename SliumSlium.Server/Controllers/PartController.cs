using Microsoft.AspNetCore.Mvc;

namespace SliumSlium.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public PartController(DatabaseContext context)
        {
            _context = context;
        }
    }
}
