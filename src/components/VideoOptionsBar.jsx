/* eslint-disable react/prop-types */
import React, { useContext } from 'react';

import {
  Button, ButtonDropdown, ButtonGroup, Col, DropdownItem, DropdownMenu, DropdownToggle, Row,
} from 'reactstrap';

import moment from 'moment';

import { VideoContext } from './VideoContext';

import useToggle from '../utils/hooks/useToggle';

const VideoOptionsBar = ({
  filteredVideos, displayType, toggleDisplayType, displayOnlyFavorites, toggleDisplayOnlyFavorites,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [videos, setVideos] = useContext(VideoContext);
  const [isDropdownOpen, toggleDropdownOpen] = useToggle();

  const sortVideos = (direction) => {
    const sorted = [...filteredVideos].sort((a, b) => moment(a.dateAdded).diff(b.dateAdded));
    return (direction === 'ascending') ? setVideos(sorted) : setVideos(sorted.reverse());
  };

  return (
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
            outline={displayOnlyFavorites === false}
            onClick={toggleDisplayOnlyFavorites}
          >
            Only Favorites
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
};

export default VideoOptionsBar;
