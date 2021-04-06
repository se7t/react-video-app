import { useState } from 'react'
import { Alert, Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Col, Container, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap'
import { Controller, useForm } from "react-hook-form"
import axios from "axios"

function App() {
  const { control, handleSubmit } = useForm();
  const [videos, setVideos] = useState([]);
  const [success, setSuccess] = useState({});

  const onSubmit = (data) => {
   
    if ( !(videos.some(video => video.id === data.videoUrl))) {
      axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${data.videoUrl}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&part=snippet`)
      .then(function (response) {
        // change to specific part of response
        if (response.data.pageInfo.totalResults !== 0) {
          setVideos([...videos, response.data.items[0]]);
          setSuccess({
            bootstrapColor: "success",
            bootstrapMessage: "Video successfully added."
          })
        } else {
          setSuccess({
            bootstrapColor: "danger",
            bootstrapMessage: "Requested video does not exist."
          })
        }
      })
      .catch(function (error) {
        console.log(error);
        setSuccess({
          bootstrapColor: "danger",
          bootstrapMessage: "Failed to fetch video. Check console for more information."
        })
      })
    } else {
      setSuccess({
        bootstrapColor: "info",
        bootstrapMessage: "Video already exists."
      });
    }
    
  }  

// regex for yt video key /\/([^\/]+)\/?$/
// yt vids are always 11 characters long
// vimeo vids are always 9 characters long

  return (
    <div>
      <Container>
        <h1 className="text-center">React Video App</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>          
          <FormGroup>
            <Label for="videoURL">Video URL:</Label>
            <Controller 
            name="videoUrl"
            control={control}
            defaultValue="dQw4w9WgXcQ"
            render={({ field }) => <Input {...field} />}
            />            
            <FormText>Supported platforms: YouTube, Vimeo.</FormText>
          </FormGroup>
          <Button type="submit" color="primary">Submit</Button>
        </Form>
        {videos.length > 0 &&
          <Alert className="mt-4" color={success.bootstrapColor}>{success.bootstrapMessage}</Alert>
          }
        <div>
          <Row xs="1" sm="2" xl="3">
            {videos.map(video => {
              return (
                <Col className="mt-4" key={video.id}>
                  <Card>
                  <CardImg top width="100%" src={video.snippet.thumbnails.medium.url} alt="Card image cap" />
                    <CardBody>
                      <CardTitle tag="h5">{video.snippet.title}</CardTitle>
                      <CardSubtitle tag="h6" className="mb-2 text-muted">{video.snippet.channelTitle}</CardSubtitle>
                      <CardText>{(video.snippet.description).replace(/^(.{11}[^\s]*).*/, "$1") }</CardText>
                      <Button>Button</Button>
                    </CardBody>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default App;
