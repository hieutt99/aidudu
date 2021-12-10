import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from '@material-ui/core';

function WorkspaceCreateModal({ openWorkspace, setOpenWorkspace }) {

  const handleWorkspaceClose = () => {
    setOpenWorkspace(false);
  }

  return (
    <Modal show={openWorkspace} onHide={handleWorkspaceClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create workspace</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/*TODO: add create form*/}
        Woohoo, you're reading this text in a modal!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleWorkspaceClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WorkspaceCreateModal;