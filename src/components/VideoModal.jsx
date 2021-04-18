/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';

const VideoModal = ({
  title, iframe, platform, videoUrl, buttonLabel, modalValue, modalMethod,
}) => (
  <div>
    <Button color="primary" onClick={modalMethod}>{buttonLabel}</Button>
    <Modal className="modal-xl" isOpen={modalValue} toggle={modalMethod}>
      <ModalHeader toggle={modalMethod}>{title}</ModalHeader>
      <ModalBody
        className="embed-responsive embed-responsive-16by9"
      >
        {ReactHtmlParser(iframe)}
      </ModalBody>
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
