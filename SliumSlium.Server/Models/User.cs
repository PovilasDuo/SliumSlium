namespace SliumSlium.Server.Models
{
    public class User
    {
        public int Id_User { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int Type { get; set; }

        public ICollection<JobOffer> JobOffers { get; set; }
    }
}
