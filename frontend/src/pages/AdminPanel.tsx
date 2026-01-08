import { useState, useEffect } from 'react'
import axios from 'axios'
import { Movie } from '../types'

const AdminPanel = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    year: new Date().getFullYear(),
    duration: 0,
    posterUrl: '',
    videoUrl: '',
    director: '',
    cast: '',
  })

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8080/api/movies?limit=100')
      setMovies(response.data.movies)
    } catch (error) {
      console.error('Failed to fetch movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'year' || name === 'duration' ? Number(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const movieData = {
        ...formData,
        genre: formData.genre.split(',').map((g) => g.trim()).filter(Boolean),
        cast: formData.cast.split(',').map((c) => c.trim()).filter(Boolean),
      }

      if (editingMovie) {
        await axios.put(`http://localhost:8080/api/movies/${editingMovie.id}`, movieData)
      } else {
        await axios.post('http://localhost:8080/api/movies', movieData)
      }

      setShowForm(false)
      setEditingMovie(null)
      setFormData({
        title: '',
        description: '',
        genre: '',
        year: new Date().getFullYear(),
        duration: 0,
        posterUrl: '',
        videoUrl: '',
        director: '',
        cast: '',
      })
      fetchMovies()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Fehler beim Speichern')
    }
  }

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      description: movie.description,
      genre: movie.genre.join(', '),
      year: movie.year,
      duration: movie.duration,
      posterUrl: movie.posterUrl,
      videoUrl: movie.videoUrl,
      director: movie.director,
      cast: movie.cast.join(', '),
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Film wirklich löschen?')) return

    try {
      await axios.delete(`http://localhost:8080/api/movies/${id}`)
      fetchMovies()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Fehler beim Löschen')
    }
  }

  const handleGenerateDescription = async (movieId: string) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/ai/movies/${movieId}/description`)
      alert(`Generierte Beschreibung:\n\n${response.data.description}`)
      fetchMovies()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Fehler beim Generieren der Beschreibung')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingMovie(null)
            setFormData({
              title: '',
              description: '',
              genre: '',
              year: new Date().getFullYear(),
              duration: 0,
              posterUrl: '',
              videoUrl: '',
              director: '',
              cast: '',
            })
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Abbrechen' : 'Neuer Film'}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {editingMovie ? 'Film bearbeiten' : 'Neuen Film erstellen'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Titel *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Jahr *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Dauer (Minuten)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Regisseur</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Genre (kommagetrennt)</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                  placeholder="Action, Drama, Comedy"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Cast (kommagetrennt)</label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                  placeholder="Schauspieler 1, Schauspieler 2"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Poster URL</label>
                <input
                  type="url"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Video URL</label>
                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                  placeholder="Pfad zum Video (z.B. uploads/videos/movie.mp4)"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Beschreibung</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                rows={4}
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                {editingMovie ? 'Aktualisieren' : 'Erstellen'}
              </button>
              {editingMovie && (
                <button
                  type="button"
                  onClick={() => handleGenerateDescription(editingMovie.id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                >
                  🤖 KI-Beschreibung generieren
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-300">Lädt...</div>
      ) : (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Filme verwalten</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-3 text-gray-300">Titel</th>
                  <th className="pb-3 text-gray-300">Jahr</th>
                  <th className="pb-3 text-gray-300">Genre</th>
                  <th className="pb-3 text-gray-300">Bewertung</th>
                  <th className="pb-3 text-gray-300">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id} className="border-b border-slate-700">
                    <td className="py-3 text-white">{movie.title}</td>
                    <td className="py-3 text-gray-300">{movie.year}</td>
                    <td className="py-3 text-gray-300">{movie.genre.join(', ')}</td>
                    <td className="py-3 text-gray-300">
                      ⭐ {movie.rating.toFixed(1)}
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(movie)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Bearbeiten
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel



