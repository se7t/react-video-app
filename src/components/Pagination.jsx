/* eslint-disable react/prop-types */
import React, { useContext } from 'react';

import ReactPaginate from 'react-paginate';
import { VideoContext } from './VideoContext';
import { PaginationContext } from './PaginationContext';

import useWindowDimensions from '../utils/hooks/useWindowDimensions';

export default function Pagination({
  videosAmount,
  filteredVideosAmount,
  videosPerPage,
  displayOnlyFavorites,
}) {
  // eslint-disable-next-line no-unused-vars
  const [videos, setVideos] = useContext(VideoContext);
  // eslint-disable-next-line no-unused-vars
  const [pageNumber, setPageNumber] = useContext(PaginationContext);
  const { width } = useWindowDimensions();

  const pageCount = () => (
    displayOnlyFavorites
      ? Math.ceil(filteredVideosAmount / videosPerPage)
      : Math.ceil(videosAmount / videosPerPage)
  );

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const BOOTSTRAP_BREAKPOINTS = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  };

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

  return (
    <div>
      {videos.length > 0
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
    </div>
  );
}
