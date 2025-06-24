export const renderStars = (score, isInteractive = false, hoverRating = 0, setHoverRating = () => {}, form = {}, setForm = () => {}) => {
  let safeScore = Number(score);
  if (isNaN(safeScore) || safeScore < 0) safeScore = 0;
  if (safeScore > 5) safeScore = 5;

  // For non-interactive display (like movie cards), return formatted text
  if (!isInteractive) {
    return (
      <span className="rating-display">
        <span className="rating-star">★</span> {safeScore.toFixed(1)}/5
      </span>
    );
  }

  // Existing interactive star rendering logic
  const stars = [];
  const displayScore = isInteractive && hoverRating > 0 ? hoverRating : safeScore;

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className="star"
        style={{
          cursor: isInteractive ? "pointer" : "default",
          color: i <= displayScore ? "gold" : "#CCCCCC", // Gold for selected, clear light grey for unselected
          fontSize: isInteractive ? "32px" : "18px", // 32px for interactive, 18px for display
          verticalAlign: "middle" // Align stars vertically
        }}
        onClick={isInteractive ? () => setForm({ ...form, rating: i }) : undefined}
        onMouseEnter={isInteractive ? () => setHoverRating(i) : undefined}
        onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
      >
        ★
      </span>
    );
  }
  return <span className="review-stars">{stars}</span>;
}; 