import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Movie, Review } from '../types'
import { useAuth } from '../contexts/AuthContext'

const MovieDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    fetchMovie()
  }, [id])

  const fetchMovie = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/movies/${id}`)
      setMovie(response.data.movie)
      setReviews(response.data.reviews || [])
    } catch (error) {
      console.error('Failed to fetch movie:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      await axios.post(`http://localhost:8080/api/movies/${id}/reviews`, {
        movieId: id,
        rating: reviewRating,
        comment: reviewComment,
      })
      setReviewComment('')
      setShowReviewForm(false)
      fetchMovie()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Fehler beim Erstellen der Bewertung')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-300">Lädt...</div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-300">Film nicht gefunden.</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-800 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-slate-700 flex items-center justify-center rounded-lg">
                <span className="text-gray-400">Kein Poster</span>
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 text-2xl">⭐</span>
              <span className="text-white text-xl ml-2">
                {movie.rating.toFixed(1)} / 5.0
              </span>
            </div>
            <p className="text-gray-300 mb-4">{movie.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-400">Jahr:</span>
                <span className="text-white ml-2">{movie.year}</span>
              </div>
              <div>
                <span className="text-gray-400">Dauer:</span>
                <span className="text-white ml-2">{movie.duration} Min</span>
              </div>
              <div>
                <span className="text-gray-400">Regisseur:</span>
                <span className="text-white ml-2">{movie.director || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400">Genre:</span>
                <span className="text-white ml-2">{movie.genre.join(', ')}</span>
              </div>
            </div>
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-4">
                <span className="text-gray-400">Cast:</span>
                <span className="text-white ml-2">{movie.cast.join(', ')}</span>
              </div>
            )}
            {isAuthenticated && movie.videoUrl && (
              <Link
                to={`/watch/${movie.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Film ansehen
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-slate-800 rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Bewertungen</h2>
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {showReviewForm ? 'Abbrechen' : 'Bewertung abgeben'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-6 bg-slate-700 p-4 rounded-lg">
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Bewertung</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg"
              >
                <option value={1}>1 Stern</option>
                <option value={2}>2 Sterne</option>
                <option value={3}>3 Sterne</option>
                <option value={4}>4 Sterne</option>
                <option value={5}>5 Sterne</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Kommentar</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg"
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Bewertung absenden
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-400">Noch keine Bewertungen.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">
                    {'⭐'.repeat(review.rating)}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-300">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetail



