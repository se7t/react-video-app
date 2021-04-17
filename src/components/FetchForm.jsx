import React, { useContext, useState } from 'react';
import getVideoId from 'get-video-id';
import { Controller, useForm } from 'react-hook-form';
import {
  Button, ButtonGroup, Col, Form, FormGroup, FormText, Input, Label, Row,
} from 'reactstrap';
import { VideoContext } from './VideoContext';
import { AlertBoxContext } from './AlertBoxContext';

import SampleVideos from '../utils/LoadSampleVideos';
import { youtube, vimeo } from '../utils/FetchVideos';

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

  const fetchVideoData = async (data) => {
    const selectedService = getVideoId(String(data.videoUrl)).service;
    const selectedId = getVideoId(String(data.videoUrl)).id || data.videoUrl;
    const videoExists = videos.some((video) => video.id === selectedId);

    // YouTube ids are always 11 characters long
    if (!videoExists && (selectedService === 'youtube' || selectedId.length === 11)) {
      await youtube.get('/videos', {
        params: {
          id: selectedId,
        },
      }).then((response) => {
        setVideos([...videos, response.data]);
      }).catch((error) => console.error(error.name, error.message));
    }

    // Vimeo ids are always 9 characters long
    if (!videoExists && (selectedService === 'vimeo' || selectedId.length === 9)) {
      await vimeo.get(`/videos/${selectedId}`).then((response) => {
        setVideos([...videos, response.data]);
      }).catch((error) => console.error(error.name, error.message));
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
