import React, {Fragment, useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {Link, withRouter} from 'react-router-dom';
import {Button, Loader, List, Message, Icon, Radio} from 'semantic-ui-react';
import {UPDATE_SERVICE} from '../../mutations';

const Service = ({item}) => {
  const [service, setService] = useState(item);
  const [
    updateService,
    {loading: updateServiceLoading, error: updateServiceError},
  ] = useMutation(UPDATE_SERVICE);
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
    })
      .then(resp => {
        setService(resp.data.updateReleaseService.releaseService);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <List.Item>
      <List.Content floated="right">
        {updateServiceLoading ? (
          <Radio toggle label="Updating" disabled checked={service.enabled} />
        ) : (
          <Radio
            toggle
            label={service.enabled ? 'Enabled' : 'Disabled'}
            disabled={
              updateServiceLoading || typeof updateServiceError === 'object'
            }
            checked={service.enabled}
            onChange={ev => toggle()}
          />
        )}
      </List.Content>
      <Icon
        name={
          updateServiceError
            ? 'warning sign'
            : service.healthStatus === 'ok'
            ? 'check'
            : 'close'
        }
        size="large"
        color={
          service.healthStatus === 'ok' && !updateServiceError ? 'green' : 'red'
        }
      />
      <List.Content>
        <List.Header>
          <Link
            className={updateServiceError ? 'text-red' : ''}
            to={`/releases/services/${service.kfId}`}
          >
            {service.name}
          </Link>
        </List.Header>
        <List.Description>
          {updateServiceError
            ? updateServiceError.message
            : service.description}
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

const ServiceList = ({services, loading, error}) => {
  if (loading) {
    return (
      <Loader active inline="centered">
        Loading Services...
      </Loader>
    );
  }
  if (error)
    return (
      <Message
        negative
        icon="warning circle"
        header="Error"
        content={error.message}
      />
    );
  if (!services) {
    return (
      <Fragment>
        No Services have been registered yet.
        <br />
        <Button as={Link} to="/service/new">
          Register a Service
        </Button>
      </Fragment>
    );
  }

  return (
    <List>
      {services.map(({node}) => (
        <Service item={node} key={node.kfId} />
      ))}
    </List>
  );
};

export default withRouter(ServiceList);
