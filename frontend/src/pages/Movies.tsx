import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Movie } from '../types'

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 12

  useEffect(() => {
    fetchGenres()
  }, [])

  useEffect(() => {
    fetchMovies()
  }, [page, search, selectedGenre])

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/movies/genres')
      setGenres(response.data.genres)
    } catch (error) {
      console.error('Failed to fetch genres:', error)
    }
  }

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const params: any = { page, limit }
      if (search) params.search = search
      if (selectedGenre) params.genre = selectedGenre

      const response = await axios.get('http://localhost:8080/api/movies', { params })
      setMovies(response.data.movies)
      setTotal(response.data.pagination.total)
    } catch (error) {
      console.error('Failed to fetch movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchMovies()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Filme</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filme durchsuchen..."
            className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
        <select
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Alle Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-300 py-12">Lädt...</div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-300 py-12">
          Keine Filme gefunden.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
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

          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              Zurück
            </button>
            <span className="text-gray-300">
              Seite {page} von {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
            >
              Weiter
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Movies



