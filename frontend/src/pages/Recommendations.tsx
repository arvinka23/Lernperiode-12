import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Movie } from '../types'

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('http://localhost:8080/api/recommendations')
      setRecommendations(response.data.recommendations)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Fehler beim Laden der Empfehlungen')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-300">Lädt Empfehlungen...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">
        🤖 KI-Empfehlungen für dich
      </h1>

      {error && (
        <div className="bg-yellow-600 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-4">
            Noch keine Empfehlungen verfügbar. Bewerte einige Filme, um personalisierte
            Empfehlungen zu erhalten!
          </p>
          <Link
            to="/movies"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Filme durchsuchen
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendations.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform"
            >
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-slate-700 flex items-center justify-center">
                  <span className="text-gray-400">Kein Poster</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {movie.year} • {movie.duration} Min
                </p>
                <div className="flex items-center">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-gray-300 ml-1">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={fetchRecommendations}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Empfehlungen aktualisieren
        </button>
      </div>
    </div>
  )
}

export default Recommendations



