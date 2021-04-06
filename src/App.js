import { useState } from 'react'
import { Button, Container, Form, FormGroup, FormText, Input, Label } from 'reactstrap'
import { Controller, useForm } from "react-hook-form"
import axios from "axios"

function App() {
  const { control, handleSubmit } = useForm();
  const [videos, setVideos] = useState([]);

  const onSubmit = (data) => {
    axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${data.videoUrl}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&part=snippet`)
    .then(function (response) {
      // change to specific part of response
      if (response.data.pageInfo.totalResults !== 0) {
        setVideos([...videos, response]);
      } else {
        console.log("Requested URL video does not exist.");
      }
    })
    .catch(function (error) {
      console.log(error);
    })
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
      </Container>
    </div>
  );
}

export default App;
