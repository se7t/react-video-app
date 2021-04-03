import React from 'react'
import { Button, Container, Form, FormGroup, FormText, Input, Label } from 'reactstrap'
import { Controller, useForm } from "react-hook-form"


function App() {
  const { control, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

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
            defaultValue=""
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
