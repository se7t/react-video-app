import React, { useContext } from 'react';

import {
  Button, ButtonGroup, Col, Jumbotron, Media, Row,
} from 'reactstrap';

import {
  Delete, Favorite, FavoriteBorderOutlined, PlayArrow,
} from '@material-ui/icons';

import moment from 'moment';
import numeral from 'numeral';

import PropTypes from 'prop-types';
import { VideoContext } from './VideoContext';

import VideoModal from './VideoModal';
import useToggle from '../utils/hooks/useToggle';

const VideoListItem = ({
  id, thumbnail, title, author, views, likes, iframe, dateAdded, platform, url, isFavorite,
}) => {
  const [videos, setVideos] = useContext(VideoContext);

  const [modal, toggleModal] = useToggle();

  const toggleFavorite = () => {
    const updatedVideos = videos.map((video) => {
      if (video.id === id) {
        return { ...video, isFavorite: !isFavorite };
      }
      return video;
    });

    setVideos(updatedVideos);
  };

  const deleteVideo = () => {
    const updatedVideos = videos.filter((video) => video.id !== id);

    setVideos(updatedVideos);
  };

  return (
    <Jumbotron className="px-1 py-4">
      <Media tag="li">
        <Media left top className="ml-4 mr-4 w-25">
          <Media object className="img-fluid" src={thumbnail} onClick={toggleModal} />
        </Media>
        <Media body>
          <Media heading tag="h5" className="mb-1">
            {title}
          </Media>
          <Media heading tag="h6" className="mb-4 text-muted">
            {author}
          </Media>
          <div className="mb-4">
            <Row>
              <Col>
                Views:
                {' '}
                {numeral(views).format('0.0a')}
              </Col>
            </Row>
            <Row>
              <Col>
                Likes:
                {' '}
                {numeral(likes).format('0.0a')}
              </Col>
            </Row>
            <Row>
              <Col>
                Added on:
                {' '}
                {moment(dateAdded).format('MMMM Do YYYY, h:mm:ss a')}
              </Col>
            </Row>
          </div>
          <Row>
            <Col>
              <ButtonGroup>
                <VideoModal
                  title={title}
                  iframe={iframe}
                  platform={platform}
                  videoUrl={url}
                  buttonLabel={<PlayArrow />}
                  modalValue={modal}
                  toggleModal={toggleModal}
                />
                {isFavorite
                  ? (
                    <Button color="warning" onClick={toggleFavorite}>
                      <FavoriteBorderOutlined />
                    </Button>
                  )
                  : (
                    <Button color="success" onClick={toggleFavorite}>
                      <Favorite />
                    </Button>
                  )}
                <Button color="danger" onClick={deleteVideo}><Delete /></Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Media>
      </Media>
    </Jumbotron>
  );
};

VideoListItem.propTypes = {
  id: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  views: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
  iframe: PropTypes.string.isRequired,
  dateAdded: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

export default VideoListItem;
