import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from '../movies/MovieCard';

const mockMovie = {
  id: '1',
  title: 'Test Movie',
  description: 'Test Description',
  posterUrl: 'https://example.com/poster.jpg',
  rating: 8.5,
  duration: '2h 30min',
  language: 'English',
  genres: ['Action', 'Drama'],
  releaseDate: '2025-01-01',
  isNewRelease: true,
  comingSoon: false,
  availableCities: ['Test City']
};

const renderMovieCard = (props = {}) => {
  return render(
    <BrowserRouter>
      <MovieCard movie={mockMovie} {...props} />
    </BrowserRouter>
  );
};

describe('MovieCard Component', () => {
  test('renders movie title', () => {
    renderMovieCard();
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  test('displays movie rating', () => {
    renderMovieCard();
    expect(screen.getByText('8.5/10')).toBeInTheDocument();
  });

  test('shows new release badge when movie is new', () => {
    renderMovieCard();
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  test('displays movie duration and language', () => {
    renderMovieCard();
    expect(screen.getByText('2h 30min')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  test('shows movie genres', () => {
    renderMovieCard();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });

  test('links to movie details page', () => {
    renderMovieCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/1');
  });

  test('handles hover state', () => {
    renderMovieCard();
    const card = screen.getByRole('link');
    fireEvent.mouseEnter(card);
    expect(card).toHaveClass('scale-105');
    fireEvent.mouseLeave(card);
    expect(card).not.toHaveClass('scale-105');
  });

  test('renders featured movie card differently', () => {
    renderMovieCard({ featured: true });
    const card = screen.getByRole('link');
    expect(card).toHaveClass('md:col-span-2');
  });

  test('handles missing poster image', () => {
    const movieWithoutPoster = { ...mockMovie, posterUrl: '' };
    render(
      <BrowserRouter>
        <MovieCard movie={movieWithoutPoster} />
      </BrowserRouter>
    );
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '');
    expect(image).toHaveAttribute('alt', 'Test Movie');
  });
});
