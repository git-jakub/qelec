using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace qelec.Services
{
    public class EmailService
    {
        // Główna metoda z pełnymi parametrami
        public async Task<bool> SendEmailAsync(string toEmail, string toName, string subject, string body, bool isHtml = true)
        {
            try
            {
                using (var smtpClient = new SmtpClient("smtp.gmail.com"))
                {
                    smtpClient.Port = 587;
                    smtpClient.Credentials = new NetworkCredential("qelectriclimited@gmail.com", "viso rgvu otdw nxue");
                    smtpClient.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("qelectriclimited@gmail.com", "QElectric Limited"),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = isHtml
                    };

                    mailMessage.To.Add(new MailAddress(toEmail, toName));

                    await smtpClient.SendMailAsync(mailMessage);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SMTP Exception: {ex.Message}");
                return false;
            }
        }

        // Przeciążenie z domyślną nazwą odbiorcy
        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            // Domyślna nazwa odbiorcy: "User"
            return await SendEmailAsync(toEmail, "User", subject, body);
        }
    }
}
