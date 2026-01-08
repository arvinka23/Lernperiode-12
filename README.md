# Stream4You - Film Streaming Plattform

Eine vollständige Full-Stack-Filmstreaming-Anwendung mit Benutzer-Authentifizierung, Filmverwaltung, Videostreaming und KI-basierten Empfehlungen über die OpenAI API.

## Projektbeschreibung

Dieses Projekt wurde im Rahmen der Lernperiode 12 (LP12) entwickelt. Ziel ist die Umsetzung einer Full-Stack-Filmstreaming-Anwendung mit modernen Technologien und Best Practices. Das Projekt dient dazu, praxisnah den Umgang mit modernen Technologien zu üben und ein vollständiges Websystem zu entwickeln.

## Technologien

### Backend

- **Golang** mit **Gin Framework** - Hochperformanter HTTP-Web-Framework
- **MongoDB** - NoSQL-Datenbank für flexible Datenspeicherung
- **JWT** - JSON Web Tokens für sichere Authentifizierung
- **OpenAI API** - KI-basierte Filmempfehlungen und Beschreibungen

### Frontend

- **React 18** mit **TypeScript** - Moderne UI-Bibliothek mit Typensicherheit
- **Vite** - Schneller Build-Tool und Development-Server
- **TailwindCSS** - Utility-first CSS Framework
- **React Router** - Client-seitiges Routing
- **Axios** - HTTP-Client für API-Kommunikation
- **React Player** - Video-Player-Komponente

## Installation & Setup

### Voraussetzungen

- Go 1.21 oder höher
- Node.js 18 oder höher
- MongoDB (lokal oder MongoDB Atlas)
- OpenAI API Key (optional, für KI-Funktionen)

### Backend Setup

1. Navigiere zum Backend-Verzeichnis:
```bash
cd backend
```

2. Installiere Go-Abhängigkeiten:
```bash
go mod download
```

3. Erstelle eine `.env` Datei im `backend` Verzeichnis:
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=stream4you
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key-here
PORT=8080
```

4. Starte den Backend-Server:
```bash
go run main.go
```

Der Server läuft standardmäßig auf `http://localhost:8080`

### Frontend Setup

1. Navigiere zum Frontend-Verzeichnis:
```bash
cd frontend
```

2. Installiere npm-Abhängigkeiten:
```bash
npm install
```

3. Starte den Development-Server:
```bash
npm run dev
```

Die Anwendung ist verfügbar unter `http://localhost:5173`

## Projektstruktur

```
stream4you/
├── backend/
│   ├── config/          # Konfigurationsdateien
│   ├── controllers/     # Request-Handler
│   ├── database/        # Datenbankverbindung
│   ├── middleware/      # Auth-Middleware
│   ├── models/          # Datenmodelle
│   ├── routes/          # API-Routen
│   ├── utils/           # Hilfsfunktionen (JWT, Password)
│   ├── main.go          # Einstiegspunkt
│   └── go.mod           # Go-Module
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React-Komponenten
│   │   ├── contexts/    # React Context (Auth)
│   │   ├── pages/       # Seiten-Komponenten
│   │   ├── types/       # TypeScript-Typen
│   │   ├── App.tsx      # Haupt-App-Komponente
│   │   └── main.tsx     # Einstiegspunkt
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## API-Endpunkte

### Authentifizierung

- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `GET /api/auth/profile` - Benutzerprofil abrufen (geschützt)

### Filme

- `GET /api/movies` - Alle Filme abrufen (mit Pagination, Suche, Filter)
  - Query-Parameter: `page`, `limit`, `search`, `genre`, `year`
- `GET /api/movies/:id` - Film-Details abrufen
- `GET /api/movies/genres` - Alle verfügbaren Genres
- `POST /api/movies` - Neuen Film erstellen (Admin)
- `PUT /api/movies/:id` - Film aktualisieren (Admin)
- `DELETE /api/movies/:id` - Film löschen (Admin)
- `POST /api/movies/:id/reviews` - Bewertung abgeben (geschützt)

### Streaming

- `GET /api/stream/:id` - Video streamen (geschützt)
- `GET /api/stream/:id/url` - Video-URL abrufen (geschützt)

### Empfehlungen & KI

- `GET /api/recommendations` - KI-Empfehlungen abrufen (geschützt)
- `POST /api/ai/movies/:id/description` - KI-Beschreibung generieren (Admin)

## Benutzerrollen

### Standard-Benutzer

- Filme durchsuchen und ansehen
- Bewertungen und Kommentare abgeben
- Personalisierte KI-Empfehlungen erhalten

### Administrator

- Alle Funktionen eines Standard-Benutzers
- Filme verwalten (CRUD-Operationen)
- KI-Beschreibungen für Filme generieren

## Features

### Implementiert

- Benutzer-Registrierung und -Anmeldung
- JWT-basierte Authentifizierung
- Filmkatalog mit Suche und Filterung
- Film-Detailseiten
- Bewertungen und Kommentare
- Video-Streaming
- Admin-Panel für Filmverwaltung
- KI-basierte Filmempfehlungen (OpenAI)
- Automatische Beschreibungsgenerierung (OpenAI)
- Responsive Design mit TailwindCSS
- Pagination für Filmübersicht
- Genre-Filterung

## Sicherheit

- Passwörter werden mit bcrypt gehasht
- JWT-Tokens für sichere Authentifizierung
- Middleware für geschützte Routen
- Admin-Middleware für administrative Funktionen
- CORS-Konfiguration für Frontend-Zugriff

## Entwicklung

### Backend-Tests ausführen

```bash
cd backend
go test ./...
```

### Frontend-Build erstellen

```bash
cd frontend
npm run build
```

### Production-Build

Für die Produktion sollten folgende Umgebungsvariablen gesetzt werden:

- `JWT_SECRET` - Starker, zufälliger Secret-Key
- `MONGODB_URI` - Produktions-MongoDB-URI
- `OPENAI_API_KEY` - OpenAI API Key (falls verwendet)

## Deployment

### Optionen

1. **Render** - Einfaches Deployment für Backend und Frontend
2. **Railway** - Container-basiertes Deployment
3. **Vercel** - Frontend-Deployment (statisch)
4. **Docker** - Containerisierung für beide Services

### Docker-Beispiel

```dockerfile
# Backend Dockerfile
FROM golang:1.21-alpine
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .
CMD ["./main"]
```

## Projekt-Roadmap

### Woche 1 - Projektgrundlage & Setup

- Projektstruktur aufsetzen
- Golang-Server einrichten
- MongoDB anbinden
- React-Setup

### Woche 2 - Authentifizierung

- User-Model und Auth-Routes
- JWT-Auth-System
- Login/Register im Frontend
- API-Tests

### Woche 3 - Filmverwaltung (Admin)

- CRUD-Endpunkte für Filme
- Validierung in MongoDB
- Admin-UI
- File-Upload

### Woche 4 - Filmkatalog

- Filmübersicht
- Detailseite
- Pagination & Suche
- React-Router

### Woche 5 - Streaming-Funktion

- Video-Player
- Streaming-Route
- Auth-Middleware
- Styling

### Woche 6 - OpenAI-Integration

- OpenAI API anbinden
- Automatische Beschreibungen generieren
- KI-Empfehlungen
- Anzeige im Frontend

### Woche 7 - Testing, Feinschliff & Deployment

- Unit-Tests
- UI-Optimierung
- Deployment vorbereiten
- Dokumentation abschliessen

## Epics (User Stories)

1. Als Benutzer möchte ich mich registrieren und anmelden können, damit ich personalisierte Inhalte sehe.
2. Als Benutzer möchte ich Filme durchsuchen und Details ansehen, damit ich passende Filme finde.
3. Als Benutzer möchte ich Filme abspielen können, damit ich sie direkt auf der Plattform ansehen kann.
4. Als Administrator möchte ich Filme verwalten, damit ich das Angebot aktuell halten kann.
5. Als Benutzer möchte ich Empfehlungen basierend auf meinem Geschmack sehen, damit ich neue Filme entdecke.
6. Als Benutzer möchte ich Bewertungen und Kommentare abgeben, damit ich meine Meinung teilen kann.
7. Als Entwickler möchte ich die App sicher, performant und ansprechend gestalten, damit sie professionell wirkt.

## Bekannte Probleme & Verbesserungen

### Aktuelle Einschränkungen

- Video-Upload muss manuell in den `uploads/videos/` Ordner erfolgen
- Keine automatische Thumbnail-Generierung
- OpenAI API Key erforderlich für KI-Funktionen

### Mögliche Erweiterungen

- File-Upload für Videos und Poster
- Benutzerprofile mit Watchlist
- Social Features (Freunde, geteilte Listen)
- Erweiterte Suchfilter
- Mobile App (React Native)
- Unit-Tests und Integration-Tests
- CI/CD Pipeline
- Monitoring und Logging

## Lizenz

Dieses Projekt wurde für Lernzwecke entwickelt.

## Autor

Entwickelt im Rahmen der Lernperiode 12 (LP12)

## Danksagungen

- Gin Framework Community
- React Team
- MongoDB
- OpenAI
