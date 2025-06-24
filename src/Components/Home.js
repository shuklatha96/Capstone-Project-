// src/Components/Home.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ReviewModal from "./ReviewModal";
import { getReviews, submitReview } from "./reviewAPI";
import MovieSearchResultsPanel from "./MovieSearchResultsPanel";
import { renderStars } from "../utils/renderStars";


// Removed OMDb API integration details (API_KEY, BASE_URL, fetchMovies function)

const fetchMoviesFromBackend = async (type = null, searchTerm = null, isFeatured = false) => {
  let url = "http://localhost:5000/api/movies";
  const params = new URLSearchParams();

  if (isFeatured) {
    url = "http://localhost:5000/api/movies/featured";
  } else {
    if (type) {
      params.append("type", type);
    }
    // searchTerm is now handled by fetchSearchResults for direct search endpoint
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies from backend:", error);
    return null; // Return null for featured movie if not found
  }
};

/* New function to fetch search results from the dedicated endpoint */
const fetchSearchResults = async (query) => {
  try {
    const res = await fetch(`http://localhost:5000/api/movies/search?query=${query}`);
    const data = await res.json(); // Always parse JSON

    if (!res.ok) {
      // Handle non-2xx status codes (e.g., 500 errors)
      throw new Error(`HTTP error! status: ${res.status}, message: ${data.message || 'Unknown error'}`);
    }

    // If status is 200 OK, but backend explicitly sends a 'No movie found' message
    if (data.message && data.message.includes('No movie found')) {
      console.log("Home.js: No movie found for search query:", query);
      return { results: [], message: data.message };
    }

    // If successful and movies are found
    return { results: data, message: null };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { results: [], message: 'Error searching movies.' };
  }
};

// Reusable Section Component with Genre Filter
const MovieSection = ({ title, movies, genreFilter, onReviewClick }) => {
  const filteredMovies = genreFilter
    ? movies.filter((m) => m.genre?.toLowerCase().includes(genreFilter.toLowerCase()))
    : movies;

  const [firstWord, ...restWords] = title.split(" ");

  return (
    <div className="container-fluid py-5 movie-section">
      <div className="scrolling-title">
        <h2>
          <span className="red-word">{firstWord}</span>
          {restWords.join(" ")}
        </h2>
      </div>

      <div className="row gx-4 gy-4">
        {filteredMovies.map((movie, index) => (
          <div className="col-md-3 col-sm-6 col-12" key={movie._id || index}>
            <div className="movie-card bg-dark text-white p-2 rounded">
              <img
                src={movie.imageUrl !== "N/A" ? movie.imageUrl : "/images/fallback.jpg"}
                alt={movie.name}
                className="img-fluid rounded"
              />
              <h5 className="movie-card-title mt-2">{movie.name}</h5>
              <div className="movie-rating mb-2">
                {movie.averageRating && (
                  <>
                    {renderStars(movie.averageRating)}
                  </>
                )}
              </div>
              <button
                className="btn movie-details-btn"
                onClick={() => {
                  console.log("MovieSection: 'View Details & Reviews' button CLICKED!");
                  onReviewClick(movie);
                }}
              >
                View Details & Reviews
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DEFAULT_FEATURED_MOVIE = {
  name: "COURT\nState vs Nobody",
  year: 2025,
  description: "A gripping courtroom drama that exposes the harsh realities of the legal system.\nWhen an ordinary young man is wrongly accused, a determined lawyer fights to\nuncover the truth, challenging the biases that threaten to condemn him.",
  imageUrl: "/images/gifcourt.mp4",
  averageRating: 4.5
};

const Home = ({ showSection, user }) => {
  console.log("Home.js: received user prop:", user);
  console.log("Home.js: received showSection prop:", showSection);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [webSeries, setWebSeries] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState(null); // New state for search messages

  const [selectedMovieToReview, setSelectedMovieToReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleReviewClick = async (movie) => {
    console.log("Home.js: Movie object passed to handleReviewClick:", movie);
    console.log("Opening review modal for:", movie.name || movie.Title);
    setSelectedMovieToReview(movie);
    setShowModal(true);
    console.log("Home.js: showModal state after click:", true);
  };

  /* Use useLocation to get search query from URL */
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    console.log("Home.js useEffect: location.search =", location.search); /* Added log */
    console.log("Home.js useEffect: extracted query =", query); /* Added log */

    if (query) {
      // Perform search when query parameter is present
      console.log("Home.js: Performing search for query:", query);
      fetchSearchResults(query).then(data => {
        console.log("Home.js: Search results data:", data); /* Added log */
        setSearchResults(data.results);
        setSearchMessage(data.message); // Set message from backend
        // Clear other sections when search results are displayed
        setTrending([]);
        setPopular([]);
        setTopRated([]);
        setTvShows([]);
        setWebSeries([]);
        setFeaturedMovie(null); // Clear featured movie
      });
    } else {
      // If no search query, fetch regular sections
      console.log("Home.js: Fetching regular sections.");
      setSearchResults([]); // Clear previous search results
      setSearchMessage(null); // Clear any old search messages

      // Always use the default featured movie for now
      setFeaturedMovie(DEFAULT_FEATURED_MOVIE);

      fetchMoviesFromBackend("Trending This Week").then(data => {
        console.log("Home.js: Fetched Trending This Week movies:", data);
        setTrending(data);
      });
      fetchMoviesFromBackend("Popular Movies").then(data => {
        console.log("Home.js: Fetched Popular Movies:", data);
        setPopular(data);
      });
      fetchMoviesFromBackend("Top Rated").then(data => {
        console.log("Home.js: Fetched Top Rated movies:", data);
        setTopRated(data);
      });
      fetchMoviesFromBackend("TV Shows").then(data => {
        console.log("Home.js: Fetched TV Shows movies:", data);
        setTvShows(data);
      });
      fetchMoviesFromBackend("Web Series").then(data => {
        console.log("Home.js: Fetched Web Series movies:", data);
        setWebSeries(data);
      });
    }
  }, [location.search]); /* Rerun effect when URL search params change */

  // Show all sections if showSection is undefined or null, or only the specified section
  const shouldShowSection = (sectionName) => {
    return !showSection || showSection === sectionName;
  };

  return (
    <div>
      {/* Remove local Search & Filter section - now handled by Navbar */}
      {/* Hero Section */}
      {!searchResults.length && !searchMessage && ( /* Only show hero if no search results/message */
        <section className="hero">
          <div className="hero-content">
            <h1 className="movie-title">{featuredMovie?.name}</h1>
            <div className="movie-meta">
              <div className="movie-rating">
                <span className="rating-star">★</span>
                <span className="rating-value">{featuredMovie?.averageRating?.toFixed(1)}</span>
              </div>
              <span className="movie-year">{featuredMovie?.year}</span>
            </div>
            <p className="movie-bio">
              {featuredMovie?.description}
            </p>
            <div className="hero-buttons">
              <button className="watch-now-btn">Watch Now</button>
              <button className="more-info-btn">More Info</button>
            </div>
          </div>
          <div className="hero-background">
            <video
              src={featuredMovie?.imageUrl}
              autoPlay
              loop
              muted
              playsInline
              className="hero-video"
            ></video>
          </div>
        </section>
      )}

      {/* Display search results or message */}
      {searchMessage && <h3 className="text-center my-4 text-white">{searchMessage}</h3>}
      {searchResults.length > 0 && (
        <MovieSearchResultsPanel
          searchResults={searchResults}
          searchMessage={searchMessage}
          onReviewClick={handleReviewClick} /* Pass handleReviewClick to search results */
        />
      )}

      {/* Conditionally render MovieSection components */}
      {shouldShowSection("Trending This Week") && (
        <MovieSection
          title="Trending This Week"
          movies={trending}
          onReviewClick={handleReviewClick}
        />
      )}
      {shouldShowSection("Popular Movies") && (
        <MovieSection
          title="Popular Movies"
          movies={popular}
          onReviewClick={handleReviewClick}
        />
      )}
      {shouldShowSection("Top Rated") && (
        <MovieSection
          title="Top Rated"
          movies={topRated}
          onReviewClick={handleReviewClick}
        />
      )}
      {shouldShowSection("TV Shows") && (
        <MovieSection
          title="TV Shows"
          movies={tvShows}
          onReviewClick={handleReviewClick}
        />
      )}
      {shouldShowSection("Web Series") && (
        <MovieSection
          title="Web Series"
          movies={webSeries}
          onReviewClick={handleReviewClick}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        show={showModal}
        onClose={() => setShowModal(false)}
        selectedMovie={selectedMovieToReview}
        user={user}
      />
    </div>
  );
};

export default Home;
