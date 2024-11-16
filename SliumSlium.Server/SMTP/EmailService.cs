using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace ShopAPI.SMTP
{
    public class EmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            using var client = new SmtpClient(_smtpSettings.Server)
            {
                Port = 587,
                Credentials = new NetworkCredential(_smtpSettings.SenderEmail, _smtpSettings.SenderPassword),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.SenderEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };

            mailMessage.To.Add(toEmail);

            try
            {
                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }
    }

}
