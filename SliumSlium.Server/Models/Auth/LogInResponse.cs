public class LogInResponse
{
    public int UserId { get; init; }

    public string Role { get; init; } = null!;

    public string Jwt { get; init; } = null!;
}