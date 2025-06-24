import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/ModalStyles.css'; // Assuming a general modal styling file for dark theme

const PreferencesModal = ({ show, onClose, onSave, currentGenre, currentMovie, currentDirector, user }) => {
  const [selectedGenre, setSelectedGenre] = useState(currentGenre || '');
  const [favoriteMovie, setFavoriteMovie] = useState(currentMovie || '');
  const [favoriteDirector, setFavoriteDirector] = useState(currentDirector || '');

  useEffect(() => {
    setSelectedGenre(currentGenre || '');
    setFavoriteMovie(currentMovie || '');
    setFavoriteDirector(currentDirector || '');
  }, [currentGenre, currentMovie, currentDirector]);

  const handleSave = () => {
    onSave({
      favoriteGenre: selectedGenre,
      favoriteMovie: favoriteMovie,
      favoriteDirector: favoriteDirector,
    });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered dialogClassName="custom-modal-dialog">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Edit Your Preferences</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Favorite Movie</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Eega"
            value={favoriteMovie}
            onChange={(e) => setFavoriteMovie(e.target.value)}
            className="custom-form-input"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Favorite Genre</Form.Label>
          <Form.Select 
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="custom-form-select" // Custom class for styling
          >
            <option value="">Select a genre</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Thriller">Thriller</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Horror">Horror</option>
            <option value="Adventure">Adventure</option>
            <option value="Animation">Animation</option>
            <option value="Crime">Crime</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Mystery">Mystery</option>
            <option value="Biography">Biography</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Favorite Director</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., S.S. Rajamouli"
            value={favoriteDirector}
            onChange={(e) => setFavoriteDirector(e.target.value)}
            className="custom-form-input"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PreferencesModal; 