import React, {useState, useRef} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {withRouter} from 'react-router-dom';
import {TaskList} from '../components/TaskList';
import {Events} from '../components/Events';
import {
  Segment,
  Container,
  Button,
  Dimmer,
  Divider,
  Grid,
  Header,
  Form,
  Icon,
  Image,
  Label,
  Loader,
  Message,
  Modal,
} from 'semantic-ui-react';
import paragraph from '../../assets/paragraph.png';
import UpdateServiceForm from '../forms/UpdateServiceForm';

import {UPDATE_SERVICE} from '../mutations';
import {GET_SERVICE, ALL_EVENTS} from '../queries';

const ServiceDetailView = ({match}) => {
  const [editing, setEditing] = useState(false);

  const relayId = Buffer.from(
    'ReleaseServiceNode:' + match.params.serviceId,
  ).toString('base64');

  const {
    loading: serviceLoading,
    error: serviceError,
    data: serviceData,
  } = useQuery(GET_SERVICE, {
    variables: {id: relayId},
  });

  const {
    loading: eventsLoading,
    error: eventsError,
    data: eventsData,
  } = useQuery(ALL_EVENTS, {
    variables: {taskService: relayId, first: 10},
  });

  const service = serviceData && serviceData.releaseService;

  const [
    updateService,
    {loading: updateServiceLoading, error: updateServiceError},
  ] = useMutation(UPDATE_SERVICE, {});

  const formRef = useRef();

  const toggle = ev => {
    updateService({
      variables: {
        id: service.id,
        input: {
          name: service.name,
          url: service.url,
          enabled: !service.enabled,
        },
      },
    });
  };

  if (serviceError)
    return (
      <Container as={Segment} basic>
        <Message negative header="Error" content={serviceError.message} />
      </Container>
    );

  if (!service || serviceLoading) {
    return (
      <Container as={Segment} basic>
        <Dimmer active inverted>
          <Loader active inverted>
            Loading Service
          </Loader>
        </Dimmer>
        <Image src={paragraph} alt="loading" />
      </Container>
    );
  }

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Release Service Detail`}</title>
      </Helmet>
      <Grid>
        <Grid.Row as={Segment} secondary basic>
          <Grid.Column width={8}>
            <Header as="h2">
              {service.name}
              <Header.Subheader>
                <Button onClick={ev => setEditing(true)}>Edit</Button>
                <Label basic>
                  <Icon name="settings" />
                  {service.kfId}
                </Label>
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column width={8} textAlign="right">
            <Form.Group grouped>
              <Form.Field inline>
                <Form.Checkbox
                  toggle
                  label="Enabled"
                  checked={service.enabled}
                  onChange={ev => toggle(ev)}
                />
              </Form.Field>
            </Form.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Form>
              <Form.Group grouped widths="equal">
                <Form.Field>
                  <label>Author</label>
                  <input
                    disabled
                    name="author"
                    type="text"
                    value={service.author}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Name</label>
                  <input
                    disabled
                    name="name"
                    type="text"
                    value={service.name}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Endpoint</label>
                  <input disabled name="url" type="text" value={service.url} />
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <label>Description</label>
                <Form.TextArea disabled value={service.description} />
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Modal open={editing}>
            <Modal.Header>Edit Task Service</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <UpdateServiceForm
                  service={service}
                  formRef={formRef}
                  error={updateServiceError}
                  onSubmit={values =>
                    updateService({
                      variables: {
                        id: values.id,
                        input: {
                          name: values.name,
                          description: values.description,
                          url: values.url,
                        },
                      },
                    })
                      .then(resp => {
                        setEditing(false);
                      })
                      .catch(err => {
                        console.log(err);
                      })
                  }
                />
              </Modal.Description>
              {updateServiceError && (
                <Message negative content={updateServiceError.message} />
              )}
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={ev => setEditing(false)}>Cancel</Button>
              <Button
                primary
                type="submit"
                onClick={(...args) => formRef.current.handleSubmit(...args)}
                loading={updateServiceLoading}
              >
                <Icon name="save" /> Save
              </Button>
            </Modal.Actions>
          </Modal>

          {serviceError && <Message negative content={serviceError} />}
        </Grid.Row>
      </Grid>

      <Divider />
      <Header as="h2">Recent Tasks</Header>
      <TaskList serviceId={service.kfId} />

      <Divider />
      <Header as="h2">Recent Events</Header>
      {eventsData && (
        <Events
          events={eventsData.allReleaseEvents.edges}
          loading={eventsLoading}
          error={eventsError}
        />
      )}
    </Container>
  );
};

export default withRouter(ServiceDetailView);
