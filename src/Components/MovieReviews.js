import React, { useEffect, useState } from 'react';

const MovieReviews = () => {
  const [movieReviews, setMovieReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/moviereviews')
      .then(res => res.json())
      .then(data => setMovieReviews(data))
      .catch((error) => {
        console.error("Failed to fetch:", error);
      });
  }, []);

  return(<div className="p-4"></div>);
//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Movie Reviews</h2>
//       {movies.map((movie, index) => (
//         <div key={index} className="bg-white shadow-md p-4 mb-3 rounded-lg">
//           <h3 className="text-lg font-semibold">{movie.title}</h3>
//           <p><strong>Rating:</strong> {movie.rating}</p>
//           <p><strong>Genre:</strong> {movie.genre}</p>
//           <p>{movie.description}</p>
//         </div>
//       ))}
//     </div>
//   );
};

export default MovieReviews;
