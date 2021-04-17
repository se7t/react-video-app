import axios from 'axios';
import moment from 'moment';

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

export const youtube = axios.create({
  baseURL: 'https://youtube.googleapis.com/youtube/v3/',
  transformResponse: [(data) => {
    const parsedData = JSON.parse(data);
    const fetchedVideo = new Video(parsedData.items[0].id,
      parsedData.items[0].snippet.thumbnails.medium.url,
      parsedData.items[0].snippet.title,
      parsedData.items[0].snippet.channelTitle,
      parsedData.items[0].statistics.viewCount,
      parsedData.items[0].statistics.likeCount,
      // YouTube does not provide iframe in API
      `<iframe src='https://youtube.com/embed/${parsedData.items[0].id}'
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    title=${parsedData.items[0].snippet.title}</iframe>`,
      // Get sortable date, then render readable date in component
      moment().format(),
      'YouTube',
      // YouTube does not provide url in API
      `https://youtube.com/${parsedData.items[0].id}`,
      false);
    return fetchedVideo;
  }],
  params: {
    part: 'snippet,statistics',
    maxResults: 1,
    key: process.env.REACT_APP_YOUTUBE_API_KEY,
  },
  timeout: 1000,
});

export const vimeo = axios.create({
  baseURL: 'https://api.vimeo.com/',
  transformResponse: [(data) => {
    const parsedData = JSON.parse(data);
    const fetchedVideo = new Video(
      // API does not provide ID, instead we get it from the URI.
      // Vimeo IDs are always 9 characters long.
      parsedData.uri.slice(-9),
      parsedData.pictures.sizes[2].link,
      parsedData.name,
      parsedData.user.name,
      // Vimeo API does not provide view count
      '0.0',
      parsedData.metadata.connections.likes.total,
      // YouTube does not provide iframe in API
      parsedData.embed.html,
      // Get sortable date, then render readable date in component
      moment().format(),
      'Vimeo',
      parsedData.link,
      false,
    );

    return fetchedVideo;
  }],
  params: {
    access_token: process.env.REACT_APP_VIMEO_API_KEY,
  },
  timeout: 1000,
});
