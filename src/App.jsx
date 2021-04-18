import React from 'react';

import { Container } from 'reactstrap';

import { AlertBoxProvider } from './components/AlertBoxContext';
import { PaginationProvider } from './components/PaginationContext';
import { VideoProvider } from './components/VideoContext';

import AlertBox from './components/AlertBox';
import FetchForm from './components/FetchForm';
import VideoList from './components/VideoList';

const App = () => (
  <div>
    <Container>
      <h1 className="text-center display-4 my-5">
        Local Video Archive
      </h1>
      <AlertBoxProvider>
        <VideoProvider>
          <FetchForm />
          <AlertBox />
          <PaginationProvider>
            <VideoList />
          </PaginationProvider>
        </VideoProvider>
      </AlertBoxProvider>
    </Container>
  </div>
);

export default App;
