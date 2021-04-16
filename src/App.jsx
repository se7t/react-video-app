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
  CardFooter,
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
  Media,
  Row,
  Jumbotron,
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
import useToggle from './utils/hooks/useToggle';
import useWindowDimensions from './utils/hooks/useWindowDimensions';

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
  const [allVideos, setAllVideos] = useState([]);
  const [alert, setAlert] = useState({ bootstrapColor: '', bootstrapMessage: '' });
  const [alertVisible, setAlertVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [isDropdownOpen, toggleDropdownOpen] = useToggle();
  const [areSamplesLoaded, setSamplesLoaded] = useState(false);
  const [isFav, toggleIsFav] = useToggle();
  const [displayType, toggleDisplayType] = useToggle();
  const { width } = useWindowDimensions();

  const videosPerPage = 6;
  const pagesVisited = pageNumber * videosPerPage;

  const filteredVideos = allVideos.filter((video) => ((isFav && video.isFavorite) || !isFav));

  const BOOTSTRAP_BREAKPOINTS = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  };

  const pageCount = () => (
    isFav
      ? Math.ceil(filteredVideos.length / videosPerPage)
      : Math.ceil(allVideos.length / videosPerPage)
  );

  const pageRange = () => {
    switch (true) {
      case width < BOOTSTRAP_BREAKPOINTS.sm:
        return 1;
      case width < BOOTSTRAP_BREAKPOINTS.md:
        return 5;
      case width < BOOTSTRAP_BREAKPOINTS.lg:
        return 9;
      case width < BOOTSTRAP_BREAKPOINTS.xl:
        return 11;
      case width < BOOTSTRAP_BREAKPOINTS.xxl:
        return 13;
      case width >= BOOTSTRAP_BREAKPOINTS.xxl:
        return 15;
      default:
        return 6;
    }
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const sortVideos = (direction) => {
    const sorted = [...filteredVideos].sort((a, b) => moment(a.dateAdded).diff(b.dateAdded));
    return (direction === 'ascending') ? setAllVideos(sorted) : setAllVideos(sorted.reverse());
  };

  const onDismiss = () => setAlertVisible(false);

  const handleToggleFavorite = (handledVideo) => {
    const updatedVideos = allVideos.map((video) => {
      if (video.id === handledVideo.id) {
        return { ...video, isFavorite: !handledVideo.isFavorite };
      }
      return video;
    });

    setAllVideos(updatedVideos);

    setAlert({
      bootstrapColor: 'success',
      bootstrapMessage: 'Updated Favorites.',
    });

    setAlertVisible(true);
  };

  const handleDeleteVideo = (handledVideo) => {
    // eslint-disable-next-line no-param-reassign
    setAllVideos(allVideos.filter((item) => item !== handledVideo));

    setAlert({
      bootstrapColor: 'success',
      bootstrapMessage: 'Video Deleted.',
    });

    setAlertVisible(true);
  };

  const handleDeleteAllVideos = () => {
    const amount = allVideos.length;
    setAllVideos([]);
    setSamplesLoaded(false);

    setAlert({
      bootstrapColor: 'success',
      bootstrapMessage: `Deleted ${amount} videos.`,
    });
    setAlertVisible(true);
  };

  // Temporarily disabled ID search
  const fetchVideoData = (data) => {
    if (!allVideos.some((video) => video.id === getVideoId(data.videoUrl).id)) {
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

              setAllVideos([...allVideos, fetchedVideo]);
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

              setAllVideos([...allVideos, fetchedVideo]);
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
      setAllVideos([...SampleVideos]);
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

  const displayVideos = filteredVideos
    .slice(pagesVisited, pagesVisited + videosPerPage)
    .map((video) => (displayType === false
      ? (
        <Col className="mt-4" key={video.id}>
          <Card className="h-100">
            {/* TODO: Open modal on thumbnail click */}
            <CardImg
              top
              width="100%"
              src={video.thumbnail}
              alt="Card image cap"
            />
            <CardBody className="d-flex flex-column justify-content-start">

              <div className="mb-4">
                <CardTitle tag="h5">{video.title}</CardTitle>
                <CardSubtitle tag="h6" className="text-muted">
                  {video.author}
                </CardSubtitle>
              </div>

              <CardText className="d-flex flex-column">
                <span>
                  Views:
                  {' '}
                  {numeral(video.views).format('0.0a')}
                </span>
                <span>
                  Likes:
                  {' '}
                  {numeral(video.likes).format('0.0a')}
                </span>
                <span>
                  Added on:
                  {' '}
                  {moment(video.dateAdded).format('MMMM Do YYYY, h:mm:ss a')}
                </span>
              </CardText>

            </CardBody>
            <CardFooter className="d-inline-flex justify-content-around">

              <VideoModal
                title={video.title}
                iframe={video.iframe}
                platform={video.platform}
                videoUrl={video.url}
                buttonLabel={<PlayArrow />}
              />

              {video.isFavorite
                ? (
                  <Button color="warning" onClick={() => handleToggleFavorite(video)}>
                    <FavoriteBorderOutlined />
                  </Button>
                )
                : (
                  <Button color="success" onClick={() => handleToggleFavorite(video)}>
                    <Favorite />
                  </Button>
                )}
              <Button color="danger" onClick={() => handleDeleteVideo(video)}><Delete /></Button>

            </CardFooter>
          </Card>
        </Col>
      )
      : (
        <Jumbotron className="px-1 py-4 mt-4">
          <Media tag="li" key={video.id}>
            <Media left top className="ml-4 mr-4 w-25">
              <Media object className="img-fluid" src={video.thumbnail} />
            </Media>
            <Media body>
              <Media heading tag="h5" className="mb-1">
                {video.title}
                {' '}
              </Media>
              <Media heading tag="h6" className="mb-4 text-muted">
                {' '}
                {video.author}
              </Media>
              <div className="mb-4">
                <Row>
                  <Col>
                    Views:
                    {' '}
                    {numeral(video.views).format('0.0a')}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Likes:
                    {' '}
                    {numeral(video.likes).format('0.0a')}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Added on:
                    {' '}
                    {moment(video.dateAdded).format('MMMM Do YYYY, h:mm:ss a')}
                  </Col>
                </Row>
              </div>
              <Row>
                <Col>
                  <ButtonGroup>
                    <VideoModal
                      title={video.title}
                      iframe={video.iframe}
                      platform={video.platform}
                      videoUrl={video.url}
                      buttonLabel={<PlayArrow />}
                    />
                    {video.isFavorite
                      ? (
                        <Button color="success" onClick={() => handleToggleFavorite(video)}>
                          <FavoriteBorderOutlined />
                        </Button>
                      )
                      : (
                        <Button color="success" onClick={() => handleToggleFavorite(video)}>
                          <Favorite />
                        </Button>
                      )}
                    <Button color="danger" onClick={() => handleDeleteVideo(video)}><Delete /></Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Media>
          </Media>
        </Jumbotron>
      )
    ));

  return (
    <div>
      <Container>
        <h1 className="text-center display-4 my-5">
          Local Video Archive
        </h1>
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
                <Button color="success" onClick={handleSampleVideos}>
                  Load Sample Videos
                </Button>
              </ButtonGroup>
            </Col>
            <Col>
              <Button color="danger" className="float-sm-right mt-4 mt-sm-0" onClick={handleDeleteAllVideos}>
                Delete all videos
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="mt-4">
          <Col>
            <ButtonDropdown isOpen={isDropdownOpen} toggle={toggleDropdownOpen}>
              <DropdownToggle caret color="info">
                Sort
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => (sortVideos('ascending'))}>Ascending</DropdownItem>
                <DropdownItem onClick={() => (sortVideos('descending'))}>Descending</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
            <ButtonGroup className="ml-4">
              <Button color="info" onClick={toggleDisplayType}>
                {displayType === true ? ('List Display') : 'Card Display'}
              </Button>
              <Button
                color="success"
                outline={isFav === false}
                onClick={toggleIsFav}
              >
                Only Favorites
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        {allVideos.length > 0 || alert.bootstrapColor === 'success'
          ? (
            <Alert className="mt-4" color={alert.bootstrapColor} isOpen={alertVisible} toggle={onDismiss}>
              {alert.bootstrapMessage}
            </Alert>
          )
          : false}

        {displayType
          ? (
            <Media list className="pl-0">
              {displayVideos}
            </Media>
          )
          : (
            <Row xs="1" sm="2" xl="3">
              {displayVideos}
            </Row>
          )}
        {allVideos.length > 0
        && (
        <ReactPaginate
          pageCount={pageCount()}
          pageRangeDisplayed={pageRange()}
          marginPagesDisplayed="1"
          previousLabel="Prev"
          nextLabel="Next"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          onPageChange={changePage}
          containerClassName="pagination justify-content-center my-5"
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
        )}
      </Container>
    </div>
  );
}

export default App;
