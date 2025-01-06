using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

public class WhatsAppService
{
    public string AccountSid { get; }
    public string AuthToken { get; }
    public string TwilioPhoneNumber { get; }

    // Constructor for dependency injection using IConfiguration
    public WhatsAppService(IConfiguration configuration)
    {
        AccountSid = configuration["Twilio:AccountSID"];
        AuthToken = configuration["Twilio:AuthToken"];
        TwilioPhoneNumber = "whatsapp:+14155238886"; // Hardcoded Twilio Sandbox Number

        TwilioClient.Init(AccountSid, AuthToken);
    }

    // Constructor that accepts three parameters
    public WhatsAppService(string accountSid, string authToken, string twilioPhoneNumber)
    {
        AccountSid = accountSid;
        AuthToken = authToken;
        TwilioPhoneNumber = twilioPhoneNumber;

        TwilioClient.Init(AccountSid, AuthToken);
    }

    public string SendWhatsAppTemplateMessage(string toPhoneNumber, string body)
    {
        var messageOptions = new CreateMessageOptions(new PhoneNumber($"whatsapp:{toPhoneNumber}"))
        {
            From = new PhoneNumber(TwilioPhoneNumber),
            Body = body
        };

        var message = MessageResource.Create(messageOptions);

        return message.Sid;
    }
}
