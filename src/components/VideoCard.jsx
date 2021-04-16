/* eslint-disable react/prop-types */
import React, { useContext } from 'react';

import {
  Button, Card, CardBody, CardFooter, CardImg, CardSubtitle, CardText, CardTitle, Col,
} from 'reactstrap';
import {
  Delete, Favorite, FavoriteBorderOutlined, PlayArrow,
} from '@material-ui/icons';

import moment from 'moment';
import numeral from 'numeral';

import { VideoContext } from './VideoContext';

import VideoModal from './VideoModal';

const VideoCard = ({
  id, thumbnail, title, author, views, likes, iframe, dateAdded, platform, url, isFavorite,
}) => {
  const [videos, setVideos] = useContext(VideoContext);

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
    <Col className="mb-4">
      <Card className="h-100">
        <CardImg
          top
          width="100%"
          src={thumbnail}
          alt="Card image cap"
        />
        <CardBody className="d-flex flex-column justify-content-start">
          <div className="mb-4">
            <CardTitle tag="h5">{title}</CardTitle>
            <CardSubtitle tag="h6" className="text-muted">
              {author}
            </CardSubtitle>
          </div>
          <CardText className="d-flex flex-column">
            <span>
              Views:
              {' '}
              {numeral(views).format('0.0a')}
            </span>
            <span>
              Likes:
              {' '}
              {numeral(likes).format('0.0a')}
            </span>
            <span>
              Added on:
              {' '}
              {moment(dateAdded).format('MMMM Do YYYY, h:mm:ss a')}
            </span>
          </CardText>
        </CardBody>
        <CardFooter className="d-inline-flex justify-content-around">
          <VideoModal
            title={title}
            iframe={iframe}
            platform={platform}
            videoUrl={url}
            buttonLabel={<PlayArrow />}
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
        </CardFooter>
      </Card>
    </Col>
  );
};

export default VideoCard;
