# Setup-Anleitung für Stream4You

## Schnellstart

### 1. MongoDB starten

**Option A: Lokal installiert**
```bash
# Windows (wenn MongoDB als Service installiert)
# MongoDB sollte automatisch laufen

# Linux/Mac
mongod
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

**Option C: MongoDB Atlas (Cloud)**
- Erstelle einen kostenlosen Account auf [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Erstelle einen Cluster
- Kopiere die Connection String in die `.env` Datei

### 2. Backend Setup

```bash
cd backend

# Erstelle .env Datei
cp .env.example .env

# Bearbeite .env und setze:
# - MONGODB_URI (z.B. mongodb://localhost:27017)
# - JWT_SECRET (starker, zufälliger String)
# - OPENAI_API_KEY (optional, für KI-Funktionen)

# Installiere Dependencies
go mod download

# Starte Server
go run main.go
```

### 3. Frontend Setup

```bash
cd frontend

# Installiere Dependencies
npm install

# Starte Development Server
npm run dev
```

### 4. Ersten Admin-Benutzer erstellen

Nach der Registrierung kannst du einen Benutzer in der MongoDB-Konsole zum Admin machen:

```javascript
// MongoDB Shell
use stream4you
db.users.updateOne(
  { email: "deine-email@example.com" },
  { $set: { role: "admin" } }
)
```

Oder verwende MongoDB Compass oder einen anderen MongoDB-Client.

## Umgebungsvariablen

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=stream4you
JWT_SECRET=dein-super-geheimer-secret-key-hier
OPENAI_API_KEY=sk-...  # Optional
PORT=8080
```

### Wichtige Hinweise

- **JWT_SECRET**: Verwende einen starken, zufälligen String in der Produktion
- **OPENAI_API_KEY**: Nur erforderlich für KI-Empfehlungen und Beschreibungsgenerierung
- **MONGODB_URI**: Für MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/`

## Video-Upload

Videos müssen manuell in den `backend/uploads/videos/` Ordner hochgeladen werden:

1. Erstelle den Ordner: `mkdir -p backend/uploads/videos`
2. Benenne die Datei nach der Movie-ID: `{movieId}.mp4`
3. Oder setze den `videoUrl` Pfad im Admin-Panel

## Troubleshooting

### Backend startet nicht

- Prüfe, ob MongoDB läuft
- Prüfe die `.env` Datei
- Prüfe, ob Port 8080 frei ist

### Frontend kann nicht mit Backend kommunizieren

- Prüfe, ob Backend auf Port 8080 läuft
- Prüfe CORS-Einstellungen in `backend/main.go`
- Prüfe Proxy-Einstellungen in `frontend/vite.config.ts`

### MongoDB-Verbindungsfehler

- Prüfe, ob MongoDB läuft: `mongosh` oder `mongo`
- Prüfe die MONGODB_URI in der `.env`
- Für MongoDB Atlas: Prüfe Firewall-Einstellungen

### OpenAI API Fehler

- Prüfe, ob API Key korrekt ist
- Prüfe, ob du Credits auf deinem OpenAI Account hast
- Die Funktionen funktionieren auch ohne OpenAI (mit Fallback-Empfehlungen)

## Docker Setup (Optional)

```bash
# Starte alle Services
docker-compose up -d

# Logs ansehen
docker-compose logs -f

# Stoppen
docker-compose down
```

## Production Deployment

Siehe README.md für Deployment-Optionen (Render, Railway, Vercel, Docker).



