import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Form, Message} from 'semantic-ui-react';

const NewServiceForm = ({history, createService, loading, error}) => {
  const [nameInput, setNameInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const handleChange = (e, {value}) => {
    e.preventDefault();
    if (e.target.name === 'name') {
      setNameInput(value);
    } else if (e.target.name === 'url') {
      setUrlInput(value);
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    const values = e.target;
    const service = {
      name: values.name.value,
      description: values.description.value,
      url: values.url.value,
    };
    createService({variables: {input: service}})
      .then(resp => {
        history.push(
          `/releases/services/${resp.data.createTaskService.taskService.kfId}`,
        );
      })
      .catch(err => {
        console.log(err);
        if (err.message.includes('url')) {
          setUrlInput('');
        }
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group widths="equal">
        <Form.Input
          fluid
          required
          name="name"
          label="Service Name"
          placeholder="My Service"
          onChange={handleChange}
        />
        <Form.Input
          fluid
          required
          error={
            error && error.message.includes('url') && urlInput.length === 0
          }
          name="url"
          label="Service Endpoint"
          placeholder="http://myservice"
          onChange={handleChange}
          value={urlInput}
        />
      </Form.Group>
      <Form.TextArea
        label="Description"
        name="description"
        placeholder="Tell us more about your service..."
      />
      {error && <Message negative header="Error" content={error.message} />}
      <Button
        color="purple"
        type="submit"
        floated="right"
        content="Register"
        loading={loading}
        disabled={nameInput.length <= 0 || urlInput.length <= 0}
      />
      <Button
        type="button"
        floated="right"
        content="Cancel"
        onClick={() => history.push(`/releases/services`)}
      />
    </Form>
  );
};

export default withRouter(NewServiceForm);
