/* eslint-disable max-classes-per-file */
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';
import {
  PlayArrow, Favorite, FavoriteBorderOutlined, Delete,
} from '@material-ui/icons';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import getVideoId from 'get-video-id';
import moment from 'moment';
import numeral from 'numeral';

class Video {
  // eslint-disable-next-line max-len
  constructor(id, thumbnail, title, author, views, likes, dateAdded, platform, isFavorite) {
    this.id = id;
    this.thumbnail = thumbnail;
    this.title = title;
    this.author = author;
    this.views = views;
    this.likes = likes;
    this.dateAdded = dateAdded;
    this.platform = platform;
    this.isFavorite = isFavorite;
  }
}

function App() {
  const { control, handleSubmit } = useForm();
  const [videos, setVideos] = useState([]);
  const [alert, setAlert] = useState({});

  const handleAddToFav = (handledVideo) => {
    // eslint-disable-next-line no-param-reassign
    handledVideo.isFavorite = !(handledVideo.isFavorite);

    setAlert({
      bootstrapColor: 'success',
      bootstrapMessage: 'Updated Favorites.',
    });
  };

  const handleDelete = (handledVideo) => {
    // eslint-disable-next-line no-param-reassign
    setVideos(videos.filter((item) => item !== handledVideo));

    setAlert({
      bootstrapColor: 'success',
      bootstrapMessage: 'Video Deleted.',
    });
  };

  // Temporarily disabled ID search
  const onSubmit = (data) => {
    if (!videos.some((video) => video.id === getVideoId(data.videoUrl).id)) {
      // change to switch
      if (getVideoId(data.videoUrl).service === 'youtube') {
        axios
          .get(
            `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=${getVideoId(data.videoUrl).id}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
          )
          .then((response) => {
            if (response.data.pageInfo.totalResults !== 0) {
              const responseData = response.data.items[0];
              const fetchedVideo = new Video(
                response.data.items[0].id,
                responseData.snippet.thumbnails.medium.url,
                responseData.snippet.title,
                responseData.snippet.channelTitle,
                responseData.statistics.viewCount,
                responseData.statistics.likeCount,
                moment().format('MMM Do YYYY, h:mm:ss a'),
                'YouTube',
                false,
              );

              setVideos([...videos, fetchedVideo]);
              setAlert({
                bootstrapColor: 'success',
                bootstrapMessage: 'Video successfully added.',
              });
            } else {
              setAlert({
                bootstrapColor: 'danger',
                bootstrapMessage: 'Requested video does not exist.',
              });
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
            setAlert({
              bootstrapColor: 'danger',
              bootstrapMessage: 'Failed to fetch video. Check console for more information.',
            });
          });
      } else if (getVideoId(data.videoUrl).service === 'vimeo') {
        axios
          .get(
            `https://api.vimeo.com/videos/${getVideoId(data.videoUrl).id
            }/?access_token=${process.env.REACT_APP_VIMEO_API_KEY}`,
          )
          .then((response) => {
            if (response.data.type === 'video') {
              const fetchedVideo = new Video(
                // API does not provide ID, instead we get it from the URI.
                // Vimeo IDs are always 9 characters long.
                response.data.uri.slice(-9),
                // API does not name the sizes, 2 stands for size 295x166.
                response.data.pictures.sizes[2].link,
                response.data.name,
                response.data.user.name,
                // Vimeo API does not provide view count
                'Unknown',
                response.data.metadata.connections.likes.total,
                moment().format('MMM Do YYYY, h:mm:ss a'),
                'YouTube',
                false,
              );

              setVideos([...videos, fetchedVideo]);
              setAlert({
                bootstrapColor: 'success',
                bootstrapMessage: 'Video successfully added.',
              });
            } else {
              setAlert({
                bootstrapColor: 'danger',
                bootstrapMessage: 'Requested video does not exist.',
              });
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
            setAlert({
              bootstrapColor: 'danger',
              bootstrapMessage: 'Failed to fetch video. Check console for more information.',
            });
          });
      }
    } else {
      setAlert({
        bootstrapColor: 'info',
        bootstrapMessage: 'Video already exists.',
      });
    }
  };

  return (
    <div>
      <Container>
        <h1 className="text-center">React Video App</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label for="videoURL">Video URL:</Label>
            <Controller
              name="videoUrl"
              control={control}
              defaultValue="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              // required by react-hook-form:
              // https://react-hook-form.com/get-started/#IntegratingwithUIlibraries
              // eslint-disable-next-line react/jsx-props-no-spreading
              render={({ field }) => <Input {...field} />}
            />
            <FormText>Supported platforms: YouTube, Vimeo.</FormText>
          </FormGroup>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Form>
        {videos.length > 0 && (
          <Alert className="mt-4" color={alert.bootstrapColor}>
            {alert.bootstrapMessage}
          </Alert>
        )}
        <div>
          <Row xs="1" sm="2" xl="3">
            {videos.map((video) => (
              <Col className="mt-4" key={video.id}>
                <Card>
                  <CardImg
                    top
                    width="100%"
                    src={video.thumbnail}
                    alt="Card image cap"
                  />
                  <CardBody>
                    <CardTitle tag="h5">{video.title}</CardTitle>
                    <CardSubtitle tag="h6" className="mb-2 text-muted">
                      {video.author}
                    </CardSubtitle>
                    <Row>
                      <Col>
                        <CardText>
                          Views:
                          {' '}
                          {numeral(video.views).format('0.0a')}
                        </CardText>
                      </Col>
                      <Col>
                        <CardText>
                          Likes:
                          {' '}
                          {numeral(video.likes).format('0.0a')}
                        </CardText>
                      </Col>
                    </Row>
                    <CardText>
                      Added on:
                      {' '}
                      {video.dateAdded}
                    </CardText>
                    <Row>
                      <Col><Button color="primary"><PlayArrow /></Button></Col>
                      <Col>
                        {video.isFavorite
                          ? (
                            <Button color="warning" onClick={() => handleAddToFav(video)}>
                              <FavoriteBorderOutlined />
                            </Button>
                          )
                          : (
                            <Button color="success" onClick={() => handleAddToFav(video)}>
                              <Favorite />
                            </Button>
                          )}

                      </Col>
                      <Col><Button color="danger" onClick={() => handleDelete(video)}><Delete /></Button></Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default App;
