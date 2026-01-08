# Stream4You - Film Streaming Plattform

Eine vollständige Full-Stack-Filmstreaming-Anwendung mit Benutzer-Authentifizierung, Filmverwaltung, Videostreaming und KI-basierten Empfehlungen über die OpenAI API.

## 📋 Projektbeschreibung

Dieses Projekt wurde im Rahmen der Lernperiode 12 (LP12) entwickelt. Ziel ist die Umsetzung einer Full-Stack-Filmstreaming-Anwendung mit modernen Technologien und Best Practices. Das Projekt dient dazu, praxisnah den Umgang mit modernen Technologien zu üben und ein vollständiges Websystem zu entwickeln.

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




# Full-Stack Filmstreaming App

## Projektbeschreibung
Dieses Projekt wurde im Rahmen der Lernperiode 12 (LP12) entwickelt. Ziel ist die Umsetzung einer Full-Stack-Filmstreaming-Anwendung mit Benutzer-Authentifizierung, Filmverwaltung, Videostreaming und einer KI-basierten Empfehlung über die OpenAI API.  
Das Projekt dient dazu, praxisnah den Umgang mit modernen Technologien zu üben und ein vollständiges Websystem zu entwickeln.

---

## Technologien
- Backend: Golang (Gin oder Fiber)
- Frontend: React mit TypeScript
- Datenbank: MongoDB
- KI-Integration: OpenAI API
- Styling: TailwindCSS
- Optional: Deployment via Render, Railway, Vercel oder Docker

---

## Ziele der Lernperiode
- Entwicklung einer vollständigen Full-Stack-Applikation
- Anwendung moderner Entwicklungspraktiken (API-Design, Datenbankanbindung, Authentifizierung)
- Nutzung von KI-Technologien über die OpenAI API
- Selbstständiges Einarbeiten in neue Frameworks und Tools

---

## Epics (User Stories)
1. Als Benutzer möchte ich mich registrieren und anmelden können, damit ich personalisierte Inhalte sehe.  
2. Als Benutzer möchte ich Filme durchsuchen und Details ansehen, damit ich passende Filme finde.  
3. Als Benutzer möchte ich Filme abspielen können, damit ich sie direkt auf der Plattform ansehen kann.  
4. Als Administrator möchte ich Filme verwalten, damit ich das Angebot aktuell halten kann.  
5. Als Benutzer möchte ich Empfehlungen basierend auf meinem Geschmack sehen, damit ich neue Filme entdecke.  
6. Als Benutzer möchte ich Bewertungen und Kommentare abgeben, damit ich meine Meinung teilen kann.  
7. Als Entwickler möchte ich die App sicher, performant und ansprechend gestalten, damit sie professionell wirkt.

---

## 7-Wochen-Plan

| Woche | Ziel | Arbeitspakete |
|-------|------|----------------|
| **1** | Projektgrundlage & Setup | 1. Projektstruktur aufsetzen <br> 2. Golang-Server einrichten <br> 3. MongoDB anbinden <br> 4. React-Setup |
| **2** | Authentifizierung | 1. User-Model und Auth-Routes <br> 2. JWT-Auth-System <br> 3. Login/Register im Frontend <br> 4. API-Tests |
| **3** | Filmverwaltung (Admin) | 1. CRUD-Endpunkte für Filme <br> 2. Validierung in MongoDB <br> 3. Admin-UI <br> 4. File-Upload |
| **4** | Filmkatalog | 1. Filmübersicht <br> 2. Detailseite <br> 3. Pagination & Suche <br> 4. React-Router |
| **5** | Streaming-Funktion | 1. Video-Player <br> 2. Streaming-Route <br> 3. Auth-Middleware <br> 4. Styling |
| **6** | OpenAI-Integration | 1. OpenAI API anbinden <br> 2. Automatische Beschreibungen generieren <br> 3. KI-Empfehlungen <br> 4. Anzeige im Frontend |
| **7** | Testing, Feinschliff & Deployment | 1. Unit-Tests <br> 2. UI-Optimierung <br> 3. Deployment vorbereiten <br> 4. Dokumentation abschliessen |

---

# Projekt-Roadmap

Dieses Dokument beschreibt die geplante Umsetzung Tag für Tag in detaillierten Arbeitspaketen.

## Tag 1 – Projektgrundlage & Setup

### 1. Repository & Grundstruktur
- GitHub-Repository erstellen (Entscheidung: Monorepo oder getrennte Repos für Backend/Frontend)
- Ordnerstruktur festlegen:

- README-Grundgerüst anlegen (Projektziel, Tech-Stack, Setup-Anleitung)

### 2. Backend-Setup (Golang)
- Go-Modul initialisieren (`go mod init github.com/deinname/projektname`)
- Web-Framework auswählen und begründen (Gin vs. Fiber → Entscheidung dokumentieren)
- Projektstruktur anlegen:
- Basisserver implementieren:
- GET `/health` Endpoint
- Server startklar mit konfigurierbarem Port und .env-Unterstützung

### 3. MongoDB Integration
- MongoDB lokal oder MongoDB Atlas einrichten
- `.env`-Datei mit Connection-String anlegen
- Go MongoDB Driver einbinden und Client initialisieren
- Verbindung testen + grundlegendes Fehlerhandling
- Ordner `/internal/database` anlegen

### 4. Frontend-Setup (React + TypeScript)
- Projekt mit Vite erstellen (`npm create vite@latest frontend -- --template react-ts`)
- Tailwind CSS installieren und konfigurieren
- `tailwind.config.js`
- Globale Styles (`index.css` mit `@tailwind` Direktiven)
- Ordnerstruktur definieren:

### 5. Basis-Dokumentation
- Setup-Anleitung für Backend und Frontend im README ergänzen
- Architektur-Entscheidungen und verwendete Technologien dokumentieren

---

## Tag 2 – Authentifizierung (Backend + Frontend)

### 1. User-Model (Backend)
- MongoDB Collection `users` anlegen
- Felder:
- `_id` (ObjectId)
- `email` (unique, lowercase)
- `passwordHash`
- `createdAt`
- Validierungsregeln (z. B. E-Mail-Format, Passwortstärke)

### 2. Auth-Routes (Backend)
- POST `/auth/register`
- POST `/auth/login`
- Request-Validierung (z. B. mit `validator` oder manuell)
- Passwort-Hashing mit bcrypt
- Fehlerfälle behandeln (E-Mail bereits vergeben, falsches Passwort, etc.)

### 3. JWT-Authentifizierung
- JWT Secret in `.env` speichern
- Sign- und Verify-Funktionen implementieren
- Auth-Middleware erstellen:
- Token aus `Authorization: Bearer <token>` Header extrahieren
- Token verifizieren
- User-ID in `c.Request.Context()` ablegen
- Hilfsfunktionen für Token-Generierung und Refresh (optional später)

### 4. Frontend: Login & Register UI
- Pages anlegen:
- `/login`
- `/register`
- Formulare mit Client-seitiger Validierung (z. B. React Hook Form + Zod)
- Globales API-Setup:
- Axios Instance oder Fetch-Wrapper mit Base-URL und Interceptors
- Nach erfolgreichem Login:
- JWT im `localStorage` oder `HttpOnly Cookie` (später) speichern
- Globalen User-State anlegen (React Context oder Zustand)

### 5. API-Tests
- Postman/Newman Collection anlegen
- Tests für:
- Erfolgreiches Register + Login
- Doppelte Registrierung
- Falsche Logindaten
- Geschützte Route mit/ohne gültigem Token
- Fehlerszenarien systematisch durchspielen

---

---


