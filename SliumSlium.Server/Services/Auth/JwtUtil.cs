using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LibraryReservationApp.Services.Auth
{
    public static class JwtUtil
    {
        public static JwtSecurityToken CreateToken(List<Claim> claims, string secret, TimeSpan duration)
        {
            if (claims == null)
                throw new ArgumentException("Argument 'claims' is null.");

            if (secret == null)
                throw new ArgumentException("Argument 'secret' is null.");

            if (secret.Length < 16)
                throw new ArgumentException("Argument 'secret' must contain a string at least 16 symbols long.");

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config.JwtSecret));
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token =
                new JwtSecurityToken(
                    issuer: "",
                    audience: "",
                    expires: DateTime.Now + duration,
                    claims: claims,
                    signingCredentials: signingCredentials
                );

            return token;
        }

        public static string SerializeToken(JwtSecurityToken token)
        {
            if (token == null)
                throw new ArgumentException("Argument 'token' is null.");

            var res = new JwtSecurityTokenHandler().WriteToken(token);

            return res;
        }
    }
}
