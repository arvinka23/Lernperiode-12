# Stream4You - Film Streaming Plattform

Eine vollständige Full-Stack-Filmstreaming-Anwendung mit Benutzer-Authentifizierung, Filmverwaltung, Videostreaming und KI-basierten Empfehlungen über die OpenAI API.

## 📋 Projektbeschreibung

Dieses Projekt wurde im Rahmen der Lernperiode 12 (LP12) entwickelt. Ziel ist die Umsetzung einer Full-Stack-Filmstreaming-Anwendung mit modernen Technologien und Best Practices.

## 🛠️ Technologien

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

## 🚀 Installation & Setup

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

## 📁 Projektstruktur

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

## 🔐 API-Endpunkte

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

## 👤 Benutzerrollen

### Standard-Benutzer
- Filme durchsuchen und ansehen
- Bewertungen und Kommentare abgeben
- Personalisierte KI-Empfehlungen erhalten

### Administrator
- Alle Funktionen eines Standard-Benutzers
- Filme verwalten (CRUD-Operationen)
- KI-Beschreibungen für Filme generieren

## 🎯 Features

### ✅ Implementiert

- [x] Benutzer-Registrierung und -Anmeldung
- [x] JWT-basierte Authentifizierung
- [x] Filmkatalog mit Suche und Filterung
- [x] Film-Detailseiten
- [x] Bewertungen und Kommentare
- [x] Video-Streaming
- [x] Admin-Panel für Filmverwaltung
- [x] KI-basierte Filmempfehlungen (OpenAI)
- [x] Automatische Beschreibungsgenerierung (OpenAI)
- [x] Responsive Design mit TailwindCSS
- [x] Pagination für Filmübersicht
- [x] Genre-Filterung

## 🔒 Sicherheit

- Passwörter werden mit bcrypt gehasht
- JWT-Tokens für sichere Authentifizierung
- Middleware für geschützte Routen
- Admin-Middleware für administrative Funktionen
- CORS-Konfiguration für Frontend-Zugriff

## 📝 Entwicklung

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

## 🚢 Deployment

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

## 📚 7-Wochen-Plan

| Woche | Ziel | Status |
|-------|------|--------|
| 1 | Projektgrundlage & Setup | ✅ |
| 2 | Authentifizierung | ✅ |
| 3 | Filmverwaltung (Admin) | ✅ |
| 4 | Filmkatalog | ✅ |
| 5 | Streaming-Funktion | ✅ |
| 6 | OpenAI-Integration | ✅ |
| 7 | Testing, Feinschliff & Deployment | ✅ |

## 🐛 Bekannte Probleme & Verbesserungen

### Aktuelle Einschränkungen

- Video-Upload muss manuell in den `uploads/videos/` Ordner erfolgen
- Keine automatische Thumbnail-Generierung
- OpenAI API Key erforderlich für KI-Funktionen

### Mögliche Erweiterungen

- [ ] File-Upload für Videos und Poster
- [ ] Benutzerprofile mit Watchlist
- [ ] Social Features (Freunde, geteilte Listen)
- [ ] Erweiterte Suchfilter
- [ ] Mobile App (React Native)
- [ ] Unit-Tests und Integration-Tests
- [ ] CI/CD Pipeline
- [ ] Monitoring und Logging

## 📄 Lizenz

Dieses Projekt wurde für Lernzwecke entwickelt.

## 👨‍💻 Autor

Entwickelt im Rahmen der Lernperiode 12 (LP12)

## 🙏 Danksagungen

- Gin Framework Community
- React Team
- MongoDB
- OpenAI

---

**Viel Erfolg mit Stream4You! 🎬**



