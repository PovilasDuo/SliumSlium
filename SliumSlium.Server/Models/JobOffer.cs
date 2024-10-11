using System.Text.Json.Serialization;

namespace SliumSlium.Server.Models
{
    public class JobOffer
    {
        public int Id_JobOffer { get; set; }
        public DateTime ValidDate { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Salary { get; set; }
        public DateTime CreationDate { get; set; }
        public string CompanyName { get; set; }
        public string Location { get; set; }
        public int WorkEnvironment { get; set; }
        public int ExperienceLevel { get; set; }
        public bool PartTime { get; set; }


        public int Fk_UserId_User { get; set; }
        public User User { get; set; }

        [JsonIgnore]
        public ICollection<Part> Parts { get; set; }
    }
}
