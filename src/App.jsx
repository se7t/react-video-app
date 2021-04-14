import React, { useState } from 'react';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
import ReactPaginate from 'react-paginate';
import useToggle from './utils/hooks';

import VideoModal from './components/VideoModal';

import SampleVideos from './utils/LoadSampleVideos';

class Video {
  // eslint-disable-next-line max-len
  constructor(id, thumbnail, title, author, views, likes, iframe, dateAdded, platform, url, isFavorite) {
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

function App() {
  const { control, handleSubmit } = useForm();
  const [videos, setVideos] = useState([]);
  const [alert, setAlert] = useState({ bootstrapColor: '', bootstrapMessage: '' });
  const [alertVisible, setAlertVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [isDropdownOpen, toggleDropdownOpen] = useToggle();
  const [areSamplesLoaded, setSamplesLoaded] = useState(false);
  const [isFav, toggleIsFav] = useToggle();

  const videosPerPage = 6;
  const pagesVisited = pageNumber * videosPerPage;

  const pageCount = Math.ceil(videos.length / videosPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const sortVideos = (direction) => {
    const sorted = [...videos].sort((a, b) => moment(a.dateAdded).diff(b.dateAdded));
    return (direction === 'ascending') ? setVideos(sorted) : setVideos(sorted.reverse());
  };

  const onDismiss = () => setAlertVisible(false);

  const handleAddToFav = (handledVideo) => {
    // eslint-disable-next-line no-param-reassign
    handledVideo.isFavorite = !(handledVideo.isFavorite);

    setAlert({
      bootstrapColor: 'success',
      bootstrapMessage: 'Updated Favorites.',
    });

    setAlertVisible(true);
  };

  const handleDeleteVideo = (handledVideo) => {
    // eslint-disable-next-line no-param-reassign
    setVideos(videos.filter((item) => item !== handledVideo));

    setAlert({
      bootstrapColor: 'success',
      bootstrapMessage: 'Video Deleted.',
    });

    setAlertVisible(true);
  };

  const handleDeleteAllVideos = () => {
    const amount = videos.length;
    setVideos([]);
    setSamplesLoaded(false);

    setAlert({
      bootstrapColor: 'success',
      bootstrapMessage: `Deleted ${amount} videos.`,
    });
    setAlertVisible(true);
  };

  // Temporarily disabled ID search
  const fetchVideoData = (data) => {
    if (!videos.some((video) => video.id === getVideoId(data.videoUrl).id)) {
      setAlertVisible(true);
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

  const handleSampleVideos = () => {
    if (areSamplesLoaded === false) {
      setVideos([...SampleVideos]);
      setSamplesLoaded(true);
      setAlert({
        bootstrapColor: 'success',
        bootstrapMessage: `Loaded ${SampleVideos.length} sample videos.`,
      });
    } else if (areSamplesLoaded === true) {
      setAlert({
        bootstrapColor: 'danger',
        bootstrapMessage: 'Sample videos are already loaded.',
      });
    }
    setAlertVisible(true);
  };

  const displayVideos = videos
    .filter((video) => ((isFav && video.isFavorite) || !isFav))
    .slice(pagesVisited, pagesVisited + videosPerPage)
    .map((video) => (
      <Col className="mt-4" key={video.id}>
        <Card>
          {/* TODO: Open modal on thumbnail click */}
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
              {moment(video.dateAdded).format('MMMM Do YYYY, h:mm:ss a')}
            </CardText>
            <Row>
              <Col>
                <VideoModal
                  title={video.title}
                  iframe={video.iframe}
                  platform={video.platform}
                  videoUrl={video.url}
                  buttonLabel={<PlayArrow />}
                />
              </Col>
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
              <Col><Button color="danger" onClick={() => handleDeleteVideo(video)}><Delete /></Button></Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    ));

  return (
    <div>
      <Container>
        <h1 className="text-center">React Video App</h1>
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
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Form>
        <ButtonGroup className="mt-4">
          <ButtonDropdown isOpen={isDropdownOpen} toggle={toggleDropdownOpen}>
            <DropdownToggle caret color="info">
              Sort
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => (sortVideos('ascending'))}>Ascending</DropdownItem>
              <DropdownItem onClick={() => (sortVideos('descending'))}>Descending</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          <Button className="ml-4" color="success" onClick={handleSampleVideos}>
            Load Sample Videos
          </Button>
          <Button className="ml-4" color="danger" onClick={handleDeleteAllVideos}>
            Delete all videos
          </Button>
          <Button
            color="secondary"
            className="ml-4"
            outline={isFav === true}
            onClick={toggleIsFav}
          >
            Favorites
          </Button>
        </ButtonGroup>
        {videos.length > 0 || alert.bootstrapColor === 'success'
          ? (
            <Alert className="mt-4" color={alert.bootstrapColor} isOpen={alertVisible} toggle={onDismiss}>
              {alert.bootstrapMessage}
            </Alert>
          )
          : false}

        <div>
          <Row xs="1" sm="2" xl="3">
            {displayVideos}
          </Row>
          {/* TODO: Fix pages amount when only favorites are displayed */}
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed="5"
            marginPagesDisplayed="1"
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            onPageChange={changePage}
            containerClassName="pagination justify-content-center mt-4"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            activeClassName="page-item active"
            activeLinkClassName="page-link "
            previousClassName="page-item"
            nextClassName="page-item"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            disabledClassName="page-item disabled"
          />
        </div>
      </Container>
    </div>
  );
}

export default App;
