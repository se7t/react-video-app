/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, createContext, useEffect } from 'react';

export const VideoContext = createContext();

export const VideoProvider = (props) => {
  const [videos, setVideos] = useState(JSON.parse(localStorage.getItem('videosStorage')));

  useEffect(() => {
    localStorage.setItem('videosStorage', JSON.stringify([...videos]));
  });

  return (
    <VideoContext.Provider value={[videos, setVideos]}>
      {props.children}
    </VideoContext.Provider>
  );
};
