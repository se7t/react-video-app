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
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import getVideoId from 'get-video-id';

class Video {
  constructor(id, thumbnail, title, author, description) {
    this.id = id;
    this.thumbnail = thumbnail;
    this.title = title;
    this.author = author;
    this.description = description;
  }
}

class YouTubeVideo extends Video {
  constructor(id, thumbnail, title, author, description) {
    super(id, thumbnail, title, author, description);
    this.platform = 'YouTube';
  }
}

class VimeoVideo extends Video {
  constructor(id, thumbnail, title, author, description) {
    super(id, thumbnail, title, author, description);
    this.platform = 'Vimeo';
  }
}

function App() {
  const { control, handleSubmit } = useForm();
  const [videos, setVideos] = useState([]);
  const [success, setSuccess] = useState({});

  // Temporarily disabled ID search
  const onSubmit = (data) => {
    if (!videos.some((video) => video.id === getVideoId(data.videoUrl).id)) {
      // change to switch
      if (getVideoId(data.videoUrl).service === 'youtube') {
        axios
          .get(
            `https://www.googleapis.com/youtube/v3/videos?id=${getVideoId(data.videoUrl).id
            }&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&part=snippet`,
          )
          .then((response) => {
            if (response.data.pageInfo.totalResults !== 0) {
              const responseData = response.data.items[0].snippet;
              const fetchedVideo = new YouTubeVideo(
                response.data.items[0].id,
                responseData.thumbnails.medium.url,
                responseData.title,
                responseData.channelTitle,
                `${responseData.description.substr(0, 250)}\u2026`, // cut description after 250 characters.
              );

              setVideos([...videos, fetchedVideo]);
              setSuccess({
                bootstrapColor: 'success',
                bootstrapMessage: 'Video successfully added.',
              });
            } else {
              setSuccess({
                bootstrapColor: 'danger',
                bootstrapMessage: 'Requested video does not exist.',
              });
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
            setSuccess({
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
              const fetchedVideo = new VimeoVideo(
                // API does not provide ID, instead we get it from the URI.
                // Vimeo IDs are always 9 characters long.
                response.data.uri.slice(-9),
                // API does not name the sizes, 2 stands for size 295x166. Sizes 0-6 are available.
                response.data.pictures.sizes[2].link,
                response.data.name,
                response.data.user.name,
                `${response.data.description.substr(0, 250)}\u2026`, // cut description after 250 characters.
              );

              setVideos([...videos, fetchedVideo]);
              setSuccess({
                bootstrapColor: 'success',
                bootstrapMessage: 'Video successfully added.',
              });
            } else {
              setSuccess({
                bootstrapColor: 'danger',
                bootstrapMessage: 'Requested video does not exist.',
              });
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
            setSuccess({
              bootstrapColor: 'danger',
              bootstrapMessage: 'Failed to fetch video. Check console for more information.',
            });
          });
      }
    } else {
      setSuccess({
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
          <Alert className="mt-4" color={success.bootstrapColor}>
            {success.bootstrapMessage}
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
                    <CardText>{video.description}</CardText>
                    <Button>Button</Button>
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
