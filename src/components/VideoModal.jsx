/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

const VideoModal = ({
  title, iframe, platform, videoUrl, buttonLabel,
}) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="primary" onClick={toggle}>{buttonLabel}</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody
          style={{ display: 'flex', justifyContent: 'center' }}
          dangerouslySetInnerHTML={
            // Vimeo provides width and height which are unnecessary
            { __html: iframe.replace('width="1920" height="1080"', '') }
          }
        />
        <ModalFooter>
          <Button
            color="primary"
            onClick={toggle}
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on
            {' '}
            {platform}
          </Button>
          {' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default VideoModal;
