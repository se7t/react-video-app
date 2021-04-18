import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';

const VideoModal = ({
  title, iframe, platform, videoUrl, buttonLabel, modalValue, toggleModal,
}) => (
  <div>
    <Button color="primary" onClick={toggleModal}>{buttonLabel}</Button>
    <Modal className="modal-xl" isOpen={modalValue} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>{title}</ModalHeader>
      <ModalBody
        className="embed-responsive embed-responsive-16by9"
      >
        {ReactHtmlParser(iframe)}
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={toggleModal}
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on
          {' '}
          {platform}
        </Button>
        {' '}
        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  </div>
);

VideoModal.propTypes = {
  title: PropTypes.string.isRequired,
  iframe: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  videoUrl: PropTypes.string.isRequired,
  buttonLabel: PropTypes.object.isRequired,
  modalValue: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default VideoModal;
