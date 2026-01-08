import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import axios from 'axios'
import { Movie } from '../types'

const WatchMovie = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovie()
  }, [id])

  const fetchMovie = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/movies/${id}`)
      setMovie(response.data.movie)
      
      // Get video URL
      const videoResponse = await axios.get(`http://localhost:8080/api/stream/${id}/url`)
      setVideoUrl(`http://localhost:8080${videoResponse.data.videoUrl}`)
    } catch (error) {
      console.error('Failed to fetch movie:', error)
    } finally {
      setLoading(false)
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
      <h1 className="text-3xl font-bold text-white mb-6">{movie.title}</h1>
      
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        {videoUrl ? (
          <div className="aspect-video">
            <ReactPlayer
              url={videoUrl}
              controls
              width="100%"
              height="100%"
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload',
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="aspect-video bg-slate-700 flex items-center justify-center rounded-lg">
            <p className="text-gray-400">
              Video nicht verfügbar. Bitte stellen Sie sicher, dass das Video hochgeladen wurde.
            </p>
          </div>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Beschreibung</h2>
        <p className="text-gray-300">{movie.description}</p>
      </div>
    </div>
  )
}

export default WatchMovie



