# Connecting Your iPhone App to The Coptic League Backend

## Quick Overview

Your iPhone app needs to:
1. Point to your backend API URL
2. Make HTTP requests to specific endpoints
3. Handle authentication with JWT tokens
4. Parse JSON responses

---

## Step 1: Your API Base URL

After deployment, your API will be at:

**Local Development:**
```
http://localhost:5000/api
```

**Production (Render):**
```
https://your-app-name.onrender.com/api
```

**Configure this in your iPhone app:**
```swift
// Swift
let API_BASE_URL = "https://your-app-name.onrender.com/api"

// Or in config file
struct APIConfig {
    static let baseURL = "https://your-app-name.onrender.com/api"
}
```

---

## Step 2: Authentication Flow

### Register a New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "555-123-4567",
  "role": "player"
}
```

**Response (Success - 201):**
```json
{
  "_id": "user_id_here",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "player",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Swift Example:**
```swift
func register(firstName: String, lastName: String, email: String, password: String, phone: String, role: String) async throws -> User {
    let url = URL(string: "\(API_BASE_URL)/auth/register")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let body: [String: Any] = [
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "phone": phone,
        "role": role
    ]

    request.httpBody = try JSONSerialization.data(withJSONObject: body)

    let (data, _) = try await URLSession.shared.data(for: request)
    let response = try JSONDecoder().decode(AuthResponse.self, from: data)

    // Save token for future requests
    UserDefaults.standard.set(response.token, forKey: "authToken")

    return response
}

struct AuthResponse: Codable {
    let _id: String
    let firstName: String
    let lastName: String
    let email: String
    let role: String
    let token: String
}
```

---

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "_id": "user_id_here",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "player",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Swift Example:**
```swift
func login(email: String, password: String) async throws -> User {
    let url = URL(string: "\(API_BASE_URL)/auth/login")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let body: [String: Any] = [
        "email": email,
        "password": password
    ]

    request.httpBody = try JSONSerialization.data(withJSONObject: body)

    let (data, response) = try await URLSession.shared.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw APIError.loginFailed
    }

    let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)

    // Save token
    UserDefaults.standard.set(authResponse.token, forKey: "authToken")

    return authResponse
}
```

---

### Get Current User Profile

**Endpoint:** `GET /api/auth/me`

**Headers Required:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "_id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "role": "player",
  "notifications": {
    "email": true,
    "sms": false
  },
  "playerProfile": {
    "jerseyNumber": 23,
    "position": "Forward",
    "height": "6'2\"",
    "weight": 180
  }
}
```

**Swift Example:**
```swift
func getProfile() async throws -> UserProfile {
    let url = URL(string: "\(API_BASE_URL)/auth/me")!
    var request = URLRequest(url: url)
    request.httpMethod = "GET"

    // Add auth token
    if let token = UserDefaults.standard.string(forKey: "authToken") {
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }

    let (data, _) = try await URLSession.shared.data(for: request)
    let profile = try JSONDecoder().decode(UserProfile.self, from: data)

    return profile
}
```

---

## Step 3: Fetching League Data

### Get All Leagues

**Endpoint:** `GET /api/leagues`

**Query Parameters (Optional):**
- `division` - Filter by division (e.g., "Mens", "High School Boys")
- `season` - Filter by season (e.g., "Summer 2025")
- `status` - Filter by status ("draft", "open", "in-progress", "completed")

**Request:**
```
GET /api/leagues
GET /api/leagues?division=Mens
GET /api/leagues?status=open
```

**Response (Success - 200):**
```json
[
  {
    "_id": "league_id_1",
    "name": "Summer 2025 Men's Basketball",
    "division": "Mens",
    "season": "Summer 2025",
    "startDate": "2025-06-01T00:00:00.000Z",
    "endDate": "2025-08-31T00:00:00.000Z",
    "registrationDeadline": "2025-05-15T00:00:00.000Z",
    "maxTeams": 12,
    "registrationFee": 150,
    "status": "open",
    "isActive": true
  },
  {
    "_id": "league_id_2",
    "name": "Summer 2025 High School Boys",
    "division": "High School Boys",
    "season": "Summer 2025",
    "startDate": "2025-06-01T00:00:00.000Z",
    "endDate": "2025-08-31T00:00:00.000Z",
    "registrationDeadline": "2025-05-15T00:00:00.000Z",
    "maxTeams": 10,
    "registrationFee": 100,
    "status": "open",
    "isActive": true
  }
]
```

**Swift Example:**
```swift
func fetchLeagues() async throws -> [League] {
    let url = URL(string: "\(API_BASE_URL)/leagues")!
    let (data, _) = try await URLSession.shared.data(from: url)
    let leagues = try JSONDecoder().decode([League].self, from: data)
    return leagues
}

struct League: Codable, Identifiable {
    let id: String
    let name: String
    let division: String
    let season: String
    let startDate: Date
    let endDate: Date
    let registrationDeadline: Date
    let maxTeams: Int
    let registrationFee: Double
    let status: String
    let isActive: Bool

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case name, division, season, startDate, endDate
        case registrationDeadline, maxTeams, registrationFee
        case status, isActive
    }
}
```

---

### Get League Details with Teams

**Endpoint:** `GET /api/leagues/:id`

**Request:**
```
GET /api/leagues/league_id_here
```

**Response (Success - 200):**
```json
{
  "_id": "league_id",
  "name": "Summer 2025 Men's Basketball",
  "division": "Mens",
  "season": "Summer 2025",
  "startDate": "2025-06-01T00:00:00.000Z",
  "endDate": "2025-08-31T00:00:00.000Z",
  "registrationDeadline": "2025-05-15T00:00:00.000Z",
  "maxTeams": 12,
  "registrationFee": 150,
  "status": "open",
  "teams": [
    {
      "_id": "team_id_1",
      "name": "Warriors",
      "wins": 5,
      "losses": 2,
      "players": [
        {
          "player": "player_id",
          "jerseyNumber": 23
        }
      ],
      "coach": {
        "firstName": "Mike",
        "lastName": "Smith"
      }
    }
  ]
}
```

---

## Step 4: Fetching Teams

### Get All Teams

**Endpoint:** `GET /api/teams`

**Query Parameters (Optional):**
- `league` - Filter by league ID

**Request:**
```
GET /api/teams
GET /api/teams?league=league_id
```

**Response (Success - 200):**
```json
[
  {
    "_id": "team_id",
    "name": "Warriors",
    "league": {
      "_id": "league_id",
      "name": "Summer 2025 Men's Basketball",
      "division": "Mens",
      "season": "Summer 2025"
    },
    "coach": {
      "_id": "coach_id",
      "firstName": "Mike",
      "lastName": "Smith",
      "email": "mike@example.com"
    },
    "players": [
      {
        "player": {
          "_id": "player_id",
          "firstName": "John",
          "lastName": "Doe",
          "playerProfile": {
            "jerseyNumber": 23,
            "position": "Forward"
          }
        },
        "jerseyNumber": 23,
        "position": "Forward",
        "status": "active"
      }
    ],
    "wins": 5,
    "losses": 2,
    "homeVenue": "Main Gym",
    "maxPlayers": 15
  }
]
```

---

## Step 5: Fetching Game Schedule

### Get All Games

**Endpoint:** `GET /api/games`

**Query Parameters (Optional):**
- `league` - Filter by league ID
- `team` - Filter by team ID (shows games for that team)
- `status` - Filter by status ("scheduled", "in-progress", "completed", "postponed", "cancelled")
- `startDate` - Filter games after date (ISO format)
- `endDate` - Filter games before date (ISO format)

**Request:**
```
GET /api/games
GET /api/games?league=league_id
GET /api/games?team=team_id
GET /api/games?status=scheduled
GET /api/games?startDate=2025-06-01&endDate=2025-06-30
```

**Response (Success - 200):**
```json
[
  {
    "_id": "game_id",
    "league": {
      "_id": "league_id",
      "name": "Summer 2025 Men's Basketball",
      "division": "Mens"
    },
    "homeTeam": {
      "_id": "team_id_1",
      "name": "Warriors",
      "wins": 5,
      "losses": 2
    },
    "awayTeam": {
      "_id": "team_id_2",
      "name": "Lakers",
      "wins": 4,
      "losses": 3
    },
    "scheduledDate": "2025-07-15T00:00:00.000Z",
    "scheduledTime": "7:00 PM",
    "venue": "Main Gym",
    "venueAddress": "123 Main St, City, State",
    "status": "scheduled",
    "homeScore": 0,
    "awayScore": 0,
    "quarter": 1
  },
  {
    "_id": "game_id_2",
    "league": {
      "_id": "league_id",
      "name": "Summer 2025 Men's Basketball",
      "division": "Mens"
    },
    "homeTeam": {
      "_id": "team_id_3",
      "name": "Bulls",
      "wins": 6,
      "losses": 1
    },
    "awayTeam": {
      "_id": "team_id_1",
      "name": "Warriors",
      "wins": 5,
      "losses": 2
    },
    "scheduledDate": "2025-07-14T00:00:00.000Z",
    "scheduledTime": "6:00 PM",
    "venue": "East Gym",
    "venueAddress": "456 Oak Ave, City, State",
    "status": "completed",
    "homeScore": 78,
    "awayScore": 82,
    "quarter": 4
  }
]
```

**Swift Example:**
```swift
func fetchGames(forTeam teamId: String? = nil) async throws -> [Game] {
    var urlString = "\(API_BASE_URL)/games"
    if let teamId = teamId {
        urlString += "?team=\(teamId)"
    }

    let url = URL(string: urlString)!
    let (data, _) = try await URLSession.shared.data(from: url)

    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .iso8601

    let games = try decoder.decode([Game].self, from: data)
    return games
}

struct Game: Codable, Identifiable {
    let id: String
    let league: LeagueBrief
    let homeTeam: TeamBrief
    let awayTeam: TeamBrief
    let scheduledDate: Date
    let scheduledTime: String
    let venue: String
    let venueAddress: String?
    let status: String
    let homeScore: Int
    let awayScore: Int

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case league, homeTeam, awayTeam, scheduledDate
        case scheduledTime, venue, venueAddress, status
        case homeScore, awayScore
    }
}
```

---

## Step 6: League Registration

### Register User for League

**Endpoint:** `POST /api/registrations`

**Headers Required:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request:**
```json
{
  "league": "league_id_here",
  "registrationType": "player",
  "shirtSize": "L",
  "emergencyWaiver": {
    "signed": true,
    "signerName": "John Doe"
  },
  "medicalInfo": {
    "allergies": "None",
    "medications": "None",
    "conditions": "None"
  },
  "notes": "Looking forward to the season!"
}
```

**Response (Success - 201):**
```json
{
  "_id": "registration_id",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "league": {
    "_id": "league_id",
    "name": "Summer 2025 Men's Basketball",
    "division": "Mens",
    "season": "Summer 2025"
  },
  "registrationType": "player",
  "paymentStatus": "pending",
  "amountPaid": 0,
  "amountDue": 150,
  "status": "submitted",
  "shirtSize": "L",
  "emergencyWaiver": {
    "signed": true,
    "signerName": "John Doe",
    "signedDate": "2025-05-01T10:30:00.000Z"
  },
  "createdAt": "2025-05-01T10:30:00.000Z"
}
```

**Swift Example:**
```swift
func registerForLeague(leagueId: String, registrationData: RegistrationData) async throws -> Registration {
    let url = URL(string: "\(API_BASE_URL)/registrations")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    // Add auth token
    if let token = UserDefaults.standard.string(forKey: "authToken") {
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }

    let encoder = JSONEncoder()
    request.httpBody = try encoder.encode(registrationData)

    let (data, response) = try await URLSession.shared.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 201 else {
        throw APIError.registrationFailed
    }

    let registration = try JSONDecoder().decode(Registration.self, from: data)
    return registration
}

struct RegistrationData: Codable {
    let league: String
    let registrationType: String
    let shirtSize: String
    let emergencyWaiver: EmergencyWaiver
    let medicalInfo: MedicalInfo
    let notes: String
}

struct EmergencyWaiver: Codable {
    let signed: Bool
    let signerName: String
}

struct MedicalInfo: Codable {
    let allergies: String
    let medications: String
    let conditions: String
}
```

---

## Step 7: League Standings

### Get League Standings

**Endpoint:** `GET /api/leagues/:id/standings`

**Request:**
```
GET /api/leagues/league_id_here/standings
```

**Response (Success - 200):**
```json
[
  {
    "rank": 1,
    "team": "Bulls",
    "wins": 8,
    "losses": 1,
    "winPercentage": "88.9",
    "gamesPlayed": 9
  },
  {
    "rank": 2,
    "team": "Warriors",
    "wins": 6,
    "losses": 3,
    "winPercentage": "66.7",
    "gamesPlayed": 9
  },
  {
    "rank": 3,
    "team": "Lakers",
    "wins": 5,
    "losses": 4,
    "winPercentage": "55.6",
    "gamesPlayed": 9
  }
]
```

---

## Step 8: Complete NetworkManager for iPhone

Here's a complete Swift class you can use:

```swift
import Foundation

class CopticLeagueAPI {
    static let shared = CopticLeagueAPI()
    private let baseURL = "https://your-app.onrender.com/api"

    private init() {}

    // MARK: - Authentication

    func login(email: String, password: String) async throws -> AuthResponse {
        let url = URL(string: "\(baseURL)/auth/login")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["email": email, "password": password]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(AuthResponse.self, from: data)

        // Save token
        UserDefaults.standard.set(response.token, forKey: "authToken")

        return response
    }

    func register(userData: RegistrationRequest) async throws -> AuthResponse {
        let url = URL(string: "\(baseURL)/auth/register")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        request.httpBody = try JSONEncoder().encode(userData)

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(AuthResponse.self, from: data)

        // Save token
        UserDefaults.standard.set(response.token, forKey: "authToken")

        return response
    }

    // MARK: - Leagues

    func fetchLeagues(division: String? = nil, status: String? = nil) async throws -> [League] {
        var components = URLComponents(string: "\(baseURL)/leagues")!
        var queryItems: [URLQueryItem] = []

        if let division = division {
            queryItems.append(URLQueryItem(name: "division", value: division))
        }
        if let status = status {
            queryItems.append(URLQueryItem(name: "status", value: status))
        }

        if !queryItems.isEmpty {
            components.queryItems = queryItems
        }

        let (data, _) = try await URLSession.shared.data(from: components.url!)
        let leagues = try JSONDecoder().decode([League].self, from: data)
        return leagues
    }

    func fetchLeagueDetails(id: String) async throws -> LeagueDetail {
        let url = URL(string: "\(baseURL)/leagues/\(id)")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let league = try JSONDecoder().decode(LeagueDetail.self, from: data)
        return league
    }

    func fetchStandings(leagueId: String) async throws -> [Standing] {
        let url = URL(string: "\(baseURL)/leagues/\(leagueId)/standings")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let standings = try JSONDecoder().decode([Standing].self, from: data)
        return standings
    }

    // MARK: - Teams

    func fetchTeams(leagueId: String? = nil) async throws -> [Team] {
        var urlString = "\(baseURL)/teams"
        if let leagueId = leagueId {
            urlString += "?league=\(leagueId)"
        }

        let url = URL(string: urlString)!
        let (data, _) = try await URLSession.shared.data(from: url)
        let teams = try JSONDecoder().decode([Team].self, from: data)
        return teams
    }

    func fetchTeamDetails(id: String) async throws -> TeamDetail {
        let url = URL(string: "\(baseURL)/teams/\(id)")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let team = try JSONDecoder().decode(TeamDetail.self, from: data)
        return team
    }

    // MARK: - Games

    func fetchGames(leagueId: String? = nil, teamId: String? = nil, status: String? = nil) async throws -> [Game] {
        var components = URLComponents(string: "\(baseURL)/games")!
        var queryItems: [URLQueryItem] = []

        if let leagueId = leagueId {
            queryItems.append(URLQueryItem(name: "league", value: leagueId))
        }
        if let teamId = teamId {
            queryItems.append(URLQueryItem(name: "team", value: teamId))
        }
        if let status = status {
            queryItems.append(URLQueryItem(name: "status", value: status))
        }

        if !queryItems.isEmpty {
            components.queryItems = queryItems
        }

        let (data, _) = try await URLSession.shared.data(from: components.url!)

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        let games = try decoder.decode([Game].self, from: data)
        return games
    }

    // MARK: - Private Helper

    private func authenticatedRequest(url: URL, method: String = "GET", body: Data? = nil) async throws -> (Data, URLResponse) {
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token = UserDefaults.standard.string(forKey: "authToken") {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body = body {
            request.httpBody = body
        }

        return try await URLSession.shared.data(for: request)
    }
}

// MARK: - Error Handling

enum APIError: Error {
    case invalidURL
    case loginFailed
    case registrationFailed
    case unauthorized
    case networkError(Error)
}
```

---

## Step 9: Testing Your Connection

### Test with curl (from terminal):

```bash
# Get all leagues
curl https://your-app.onrender.com/api/leagues

# Login
curl -X POST https://your-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get games
curl https://your-app.onrender.com/api/games
```

### Test from iPhone app:

1. Start with simple GET request to `/api/leagues`
2. Verify you receive JSON response
3. Test login with hardcoded credentials
4. Test authenticated endpoints with token

---

## Summary: What Your iPhone App Needs

1. **API Base URL:** `https://your-app.onrender.com/api`
2. **For Public Data:** Just make GET requests
3. **For User Actions:**
   - Login/Register to get JWT token
   - Include token in header: `Authorization: Bearer <token>`
4. **Parse JSON responses** using Codable structs

---

## Need Help?

**Common Issues:**

Q: "Getting 401 Unauthorized"
A: Check your JWT token is included in Authorization header

Q: "Connection refused"
A: Make sure backend is deployed and running

Q: "Can't reach localhost from iPhone"
A: Use your computer's IP address (e.g., http://192.168.1.100:5000/api) or deploy to Render

Q: "CORS error"
A: Backend already configured for CORS, but make sure you're using the correct URL

---

Let me know if you need:
- [ ] Complete Swift models for all endpoints
- [ ] Alamofire integration (if you use that library)
- [ ] Combine/async await examples
- [ ] SwiftUI integration examples
- [ ] Help testing specific endpoints
