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

