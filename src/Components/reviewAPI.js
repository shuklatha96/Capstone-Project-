export const getReviews = async (midOrImdbID) => {
  try {
    // Assuming backend /api/reviews/:mid can handle either MongoDB _id or imdbID
    // For now, it expects MongoDB _id. We'll ensure the modal always has the _id if possible.
    const res = await fetch(`http://localhost:5000/api/reviews?mid=${midOrImdbID}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return [];
  }
};

export const submitReview = async (movieData, review) => {
  const token = localStorage.getItem('authToken'); // Get token for authenticated request
  try {
    const payload = {
      score: review.score,
      msg: review.comment,
    };

    // If movieData has an _id (admin-added movie), use it as mid
    if (movieData._id) {
      payload.mid = movieData._id;
    } else if (movieData.imdbID) {
      // If it's an API movie with imdbID, send all necessary details
      payload.imdbID = movieData.imdbID;
      payload.name = movieData.Title || movieData.name; // OMDb uses 'Title'
      payload.cast = movieData.Actors || movieData.cast; // OMDb uses 'Actors'
      payload.genre = movieData.Genre || movieData.genre; // OMDb uses 'Genre'
      payload.duration = movieData.Runtime || movieData.duration; // OMDb uses 'Runtime'
      payload.year = movieData.Year || movieData.year; // OMDb uses 'Year'
      payload.description = movieData.Plot || movieData.description; // OMDb uses 'Plot'
    }

    const res = await fetch(`http://localhost:5000/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to submit review");
    }
    return await res.json();
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error; // Re-throw to be caught by component
  }
};

