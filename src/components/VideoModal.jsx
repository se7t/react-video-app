/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

const VideoModal = ({
  title, iframe, platform, videoUrl, buttonLabel, modalValue, modalMethod,
}) => (
  <div>
    <Button color="primary" onClick={modalMethod}>{buttonLabel}</Button>
    <Modal isOpen={modalValue} toggle={modalMethod}>
      <ModalHeader toggle={modalMethod}>{title}</ModalHeader>
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
          onClick={modalMethod}
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on
          {' '}
          {platform}
        </Button>
        {' '}
        <Button color="secondary" onClick={modalMethod}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
);

export default VideoModal;
