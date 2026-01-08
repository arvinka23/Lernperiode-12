import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Willkommen bei Stream4You
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Deine persönliche Film-Streaming-Plattform mit KI-Empfehlungen
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/movies"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
          >
            Filme entdecken
          </Link>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
            >
              Jetzt registrieren
            </Link>
          )}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-3">
            🎬 Große Filmauswahl
          </h3>
          <p className="text-gray-300">
            Entdecke Hunderte von Filmen aus verschiedenen Genres und Jahren.
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-3">
            🤖 KI-Empfehlungen
          </h3>
          <p className="text-gray-300">
            Erhalte personalisierte Filmempfehlungen basierend auf deinem Geschmack.
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-3">
            ⭐ Bewertungen & Kommentare
          </h3>
          <p className="text-gray-300">
            Teile deine Meinung und hilf anderen, die besten Filme zu finden.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home



