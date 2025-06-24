import React from "react";

const MovieSearchResultsPanel = ({ searchResults, genreFilter, onReviewClick, renderStars, searchMessage }) => {
    const filteredResults = genreFilter
      ? searchResults.filter((movie) =>
          movie.genre?.toLowerCase().includes(genreFilter.toLowerCase())
        )
      : searchResults;
  
    return (
      <div className="container my-5">
        <h3 className="text-white mb-4">Search Results</h3>
        <div className="row g-4">
          {searchMessage ? (
            <p className="text-white text-center w-100">{searchMessage}</p>
          ) : filteredResults.length === 0 ? (
            <p className="text-white">No results match the selected genre.</p>
          ) : (
            filteredResults.map((movie) => (
              <div className="col-md-4" key={movie._id || movie.imdbID}>
                <div className="card bg-dark text-white h-100">
                  <img
                    src={movie.imageUrl !== "N/A" ? movie.imageUrl : "/images/fallback.jpg"}
                    alt={movie.name}
                    className="card-img-top"
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.name}</h5>
                    <p className="card-text small text-muted">
                      {movie.year} • {movie.genre}
                    </p>
                    {movie.averageRating && (
                      <div className="d-flex align-items-center mb-2">
                        {renderStars(movie.averageRating)}
                        <span className="rating-value ms-2">{movie.averageRating.toFixed(1)}/5</span>
                      </div>
                    )}
                    <p className="card-text">{movie.description.slice(0, 100)}...</p>
                  </div>
                  <div className="card-footer d-flex justify-content-between text-muted small">
                    <button
                      className="btn btn-light btn-sm text-dark w-100"
                      onClick={() => onReviewClick(movie)}
                    >
                      📝 Reviews
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  export default MovieSearchResultsPanel;
