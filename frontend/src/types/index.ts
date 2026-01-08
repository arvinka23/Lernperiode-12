export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface Movie {
  id: string
  title: string
  description: string
  genre: string[]
  year: number
  duration: number
  rating: number
  posterUrl: string
  videoUrl: string
  director: string
  cast: string[]
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  movieId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
}



