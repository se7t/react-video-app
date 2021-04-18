import React, { useState, createContext, useEffect } from 'react';
import PropTypes from 'prop-types';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState(JSON.parse(localStorage.getItem('videosStorage')) || []);

  useEffect(() => {
    localStorage.setItem('videosStorage', JSON.stringify([...videos]));
  });

  return (
    <VideoContext.Provider value={[videos, setVideos]}>
      {children}
    </VideoContext.Provider>
  );
};

VideoProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
};
