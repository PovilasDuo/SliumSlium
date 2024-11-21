using AutoMapper;
using LibraryReservationApp.Data;
using LibraryReservationApp.DataTransferObjects;
using LibraryReservationApp.Models;
using LibraryReservationApp.Models.Auth;
using LibraryReservationApp.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LibraryReservationApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IMapper _mapper;

        public AuthenticationController(IMapper mapper, LibraryContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(User_GetDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null) return NotFound();

            var userDto = _mapper.Map<User_GetDTO>(user);
            return Ok(userDto);
        }

        [HttpPost("signup")]
        [ProducesResponseType(typeof(LogInResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SignUpAsync([FromBody] SignUpModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid sign-up details.");
            }

            var result = await SignUp(model);

            if (result is ConflictObjectResult conflictResult)
            {
                return Conflict(conflictResult.Value);
            }

            return Ok(result);
        }

        [HttpGet("login")]
        [ProducesResponseType(typeof(LogInResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> LogInAsync([FromQuery] LoginModel model)
        {
            if (ModelState.IsValid is false)
            {
                return BadRequest("Invalid login credentials.");
            }

            var token = await Login(model);
            if (token is null)
            {
                return BadRequest("Invalid login credentials.");
            }

            return Ok(token);
        }

        [HttpGet("logout")]
        public async Task LogOut()
        {
            await Logout();
        }

        private async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        private async Task<IActionResult> SignUp(SignUpModel model)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser != null)
            {
                return new ConflictObjectResult(new { Message = "A user with this email already exists." });
            }

            var newUser = new User
            {
                Name = model.Name,
                Email = model.Email,
                Password = model.Password,
                Role = model.Role
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var role = newUser.Role == 1 ? "user" : "admin";
            var token = GenerateToken(
                new KeyValuePair<string, string>("userId", newUser.Id.ToString()),
                new KeyValuePair<string, string>("role", role)
            );

            var response = new LogInResponse
            {
                UserId = newUser.Id,
                Role = role,
                Jwt = token
            };
            return new OkObjectResult(response);
        }

        private async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.UserName);

            if (user == null || user.Password != model.Password)
            {
                return null;
            }

            var role = user.Role == 2 ? "admin" : "user";
            var token = GenerateToken(
                new KeyValuePair<string, string>("userId", user.Id.ToString()),
                new KeyValuePair<string, string>("role", role)
            );

            var result = new LogInResponse()
            {
                UserId = user.Id,
                Role = role,
                Jwt = token
            };

            return new OkObjectResult(result);
        }

        private string GenerateToken(params KeyValuePair<string, string>[] claims)
        {
            var tokenClaims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, claims.First(c => c.Key == "userId").Value)
        };

            var additionalClaims = claims
                .Select(customClaim => new Claim(customClaim.Key, customClaim.Value));
            tokenClaims.AddRange(additionalClaims);

            var token = JwtUtil.CreateToken(tokenClaims, Config.JwtSecret, TimeSpan.FromHours(8));
            var tokenString = JwtUtil.SerializeToken(token);

            return tokenString;
        }

        private Task Logout() => Task.CompletedTask;
    }
}
