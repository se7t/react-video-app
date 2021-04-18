import React, { useContext, useState } from 'react';

import { Media, Row } from 'reactstrap';

import { PaginationContext } from './PaginationContext';
import { VideoContext } from './VideoContext';

import useToggle from '../utils/hooks/useToggle';

import Pagination from './Pagination';
import VideoCard from './VideoCard';
import VideoListItem from './VideoListItem';
import VideoOptionsBar from './VideoOptionsBar';

const VideoList = () => {
  const [pageNumber, setPageNumber] = useContext(PaginationContext);
  // eslint-disable-next-line no-unused-vars
  const [videos, setVideos] = useContext(VideoContext);
  const [displayOnlyFavorites, toggleDisplayOnlyFavorites] = useToggle();
  const [displayType, setDisplayType] = useState('card');

  const videosPerPage = 6;

  const pagesVisited = pageNumber * videosPerPage;

  const filteredVideos = videos.filter((video) => (
    (displayOnlyFavorites && video.isFavorite) || !displayOnlyFavorites));

  const displayVideos = filteredVideos
    .slice(pagesVisited, pagesVisited + videosPerPage)
    .map((video) => (displayType === 'card'
      ? (
        <VideoCard
          key={video.id}
          id={video.id}
          thumbnail={video.thumbnail}
          title={video.title}
          author={video.author}
          views={video.views}
          likes={video.likes}
          iframe={video.iframe}
          dateAdded={video.dateAdded}
          platform={video.platform}
          url={video.url}
          isFavorite={video.isFavorite}
        />
      )
      : (
        <VideoListItem
          key={video.id}
          id={video.id}
          thumbnail={video.thumbnail}
          title={video.title}
          author={video.author}
          views={video.views}
          likes={video.likes}
          iframe={video.iframe}
          dateAdded={video.dateAdded}
          platform={video.platform}
          url={video.url}
          isFavorite={video.isFavorite}
        />
      )));

  return (
    <div>
      <VideoOptionsBar
        filteredVideos={filteredVideos}
        displayType={displayType}
        setDisplayType={setDisplayType}
        displayOnlyFavorites={displayOnlyFavorites}
        toggleDisplayOnlyFavorites={toggleDisplayOnlyFavorites}
        setPageNumber={setPageNumber}
      />
      {displayType === 'card'
        ? (

          <Row xs="1" sm="2" xl="3" className="mt-4">
            {displayVideos}
          </Row>
        )
        : (
          <Media list className="pl-0 mt-4">
            {displayVideos}
          </Media>
        )}
      <Pagination
        videosAmount={videos.length}
        filteredVideosAmount={filteredVideos.length}
        videosPerPage={videosPerPage}
        displayOnlyFavorites={displayOnlyFavorites}
      />
    </div>
  );
};

export default VideoList;
