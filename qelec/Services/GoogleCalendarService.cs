
using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Services;

namespace qelec.Services;
public class GoogleCalendarService
{
    static string[] Scopes = { CalendarService.Scope.Calendar };
    static string ApplicationName = "TimePlanner Service Accoun";

    public static CalendarService GetService()
    {
        // Wskaż ścieżkę do pliku JSON
        string credPath = "App_Data/calendarapi-439609-4c7844e96e0e.json"; // Upewnij się, że plik JSON znajduje się we właściwym miejscu

        GoogleCredential credential;

        using (var stream = new FileStream(credPath, FileMode.Open, FileAccess.Read))
        {
            // Uwierzytelnienie
            credential = GoogleCredential.FromStream(stream).CreateScoped(Scopes);
        }

        // Utwórz Google Calendar API Service
        var service = new CalendarService(new BaseClientService.Initializer()
        {
            HttpClientInitializer = credential,
            ApplicationName = ApplicationName,
        });

        return service;
    }
}
