import React from 'react';
import {Link} from 'react-router-dom';
import {Checkbox, List} from 'semantic-ui-react';

const Service = ({service, selected, onChange}) => (
  <List.Item>
    <List.Content floated="left" verticalAlign="middle">
      <Checkbox checked={selected} onChange={e => onChange(service)} />
    </List.Content>
    <List.Content>
      <List.Header>
        <Link to={`/releases/services/${service.kfId}`}>{service.name}</Link>
      </List.Header>
      <List.Description>{service.description}</List.Description>
    </List.Content>
  </List.Item>
);

const ServiceSelect = ({services, selected, onChange}) => (
  <List divided>
    {services.map(service => (
      <Service
        service={service}
        selected={selected.map(s => s.id).includes(service.id)}
        key={service.kfId}
        onChange={onChange}
      />
    ))}
  </List>
);

export default ServiceSelect;
