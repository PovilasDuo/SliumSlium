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
            if (claims == null || claims.Count == 0)
                throw new ArgumentException("Argument 'claims' cannot be null or empty.", nameof(claims));

            if (string.IsNullOrWhiteSpace(secret))
                throw new ArgumentException("Argument 'secret' cannot be null or whitespace.", nameof(secret));

            if (secret.Length < 16)
                throw new ArgumentException("Argument 'secret' must be at least 16 characters long.", nameof(secret));

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "SliumSlium",
                audience: "api.SliumSlium",
                expires: DateTime.UtcNow.Add(duration),
                claims: claims,
                signingCredentials: signingCredentials
            );

            return token;
        }

        public static string SerializeToken(JwtSecurityToken token)
        {
            if (token == null)
                throw new ArgumentException("Argument 'token' cannot be null.", nameof(token));

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
