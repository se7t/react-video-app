import React, { useContext, useState } from 'react';
import axios from 'axios';
import getVideoId from 'get-video-id';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import {
  Button, ButtonGroup, Col, Form, FormGroup, FormText, Input, Label, Row,
} from 'reactstrap';
import { VideoContext } from './VideoContext';
import { AlertBoxContext } from './AlertBoxContext';

import SampleVideos from '../utils/LoadSampleVideos';

class Video {
  constructor(
    id,
    thumbnail,
    title,
    author,
    views,
    likes,
    iframe,
    dateAdded,
    platform,
    url,
    isFavorite,
  ) {
    this.id = id;
    this.thumbnail = thumbnail;
    this.title = title;
    this.author = author;
    this.views = views;
    this.likes = likes;
    this.iframe = iframe;
    this.dateAdded = dateAdded;
    this.platform = platform;
    this.url = url;
    this.isFavorite = isFavorite;
  }
}

export default function FetchForm() {
  const [videos, setVideos] = useContext(VideoContext);
  // eslint-disable-next-line no-unused-vars
  const [alert, setAlert] = useContext(AlertBoxContext);
  const { control, handleSubmit } = useForm();
  const [areSamplesLoaded, setSamplesLoaded] = useState(false);

  const loadSampleVideos = () => {
    if (areSamplesLoaded === false) {
      setVideos([...SampleVideos]);
      setSamplesLoaded(true);
      setAlert({
        bootstrapColor: 'success',
        bootstrapMessage: `Loaded ${SampleVideos.length} sample videos.`,
        visible: true,
      });
    } else if (areSamplesLoaded === true) {
      setAlert({
        bootstrapColor: 'danger',
        bootstrapMessage: 'Sample videos are already loaded.',
        visible: true,
      });
    }
  };

  const deleteAllVideos = () => {
    const amount = videos.length;
    setVideos([]);
    setSamplesLoaded(false);

    setAlert({
      bootstrapColor: 'success',
      bootstrapMessage: `Deleted ${amount} videos.`,
      visible: true,
    });
  };

  // Temporarily disabled ID search
  const fetchVideoData = (data) => {
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
                // YouTube does not provide iframe in API
                `<iframe src='https://youtube.com/embed/${response.data.items[0].id}' 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen 
                title=${responseData.snippet.title}</iframe>`,
                // Get sortable date, then render readable date in component
                moment().format(),
                'YouTube',
                // YouTube does not provide url in API
                `https://youtube.com/${response.data.items[0].id}`,
                false,
              );

              setVideos([...videos, fetchedVideo]);
              setAlert({
                bootstrapColor: 'success',
                bootstrapMessage: 'Video successfully added.',
                visible: true,
              });
            } else {
              setAlert({
                bootstrapColor: 'danger',
                bootstrapMessage: 'Requested video does not exist.',
                visible: true,
              });
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
            setAlert({
              bootstrapColor: 'danger',
              bootstrapMessage: 'Failed to fetch video. Check console for more information.',
              visible: true,
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
                response.data.embed.html,
                moment().format(),
                'YouTube',
                response.data.link,
                false,
              );

              setVideos([...videos, fetchedVideo]);
              setAlert({
                bootstrapColor: 'success',
                bootstrapMessage: 'Video successfully added.',
                visible: true,
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
              visible: true,
            });
          });
      }
    } else {
      setAlert({
        bootstrapColor: 'info',
        bootstrapMessage: 'Video already exists.',
        visible: true,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(fetchVideoData)}>
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
      <Row xs="1" sm="2">
        <Col>
          <ButtonGroup>
            <Button type="submit" color="primary">
              Submit
            </Button>
            <Button type="button" color="success" onClick={loadSampleVideos}>
              Load Sample Videos
            </Button>
          </ButtonGroup>
        </Col>
        <Col>
          <Button type="button" color="danger" onClick={deleteAllVideos} className="float-sm-right mt-4 mt-sm-0">
            Delete all videos
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
