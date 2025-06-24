import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/ModalStyles.css'; // Reusing general modal styling

const AvatarModal = ({ show, onClose, onSave, currentAvatarUrl }) => {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || '');

  useEffect(() => {
    setAvatarUrl(currentAvatarUrl || '');
  }, [currentAvatarUrl]);

  const handleSave = () => {
    onSave(avatarUrl);
    onClose();
  };

  const handleDelete = () => {
    onSave(''); // Send empty string to delete avatar
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered dialogClassName="custom-modal-dialog">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Change Your Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Avatar Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter new avatar URL (e.g., https://example.com/new-avatar.jpg)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="custom-form-input"
          />
        </Form.Group>
        {currentAvatarUrl && (
          <div className="current-avatar-preview text-center mb-3">
            <p>Current Avatar:</p>
            <img src={currentAvatarUrl} alt="Current Avatar" className="rounded-circle" style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #e50914' }} />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {currentAvatarUrl && (
          <Button variant="secondary" onClick={handleDelete} className="me-auto">
            Delete Avatar
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save Avatar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AvatarModal; 