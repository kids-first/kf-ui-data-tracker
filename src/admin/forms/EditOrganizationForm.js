import React from 'react';
import {Form, Icon, Image} from 'semantic-ui-react';

const EditOrganizationForm = ({formikProps}) => (
  <Form onSubmit={formikProps.handleSubmit}>
    <Form.Group>
      <Form.Field>
        {formikProps.values.image ? (
          <Image circular size="tiny" src={formikProps.values.image} />
        ) : (
          <Icon circular size="big" name="building" />
        )}
      </Form.Field>
      <Form.Field width="8">
        <label htmlFor="image">Image url</label>
        <Form.Input
          fluid
          name="image"
          value={formikProps.values.image}
          onChange={formikProps.handleChange}
        />
      </Form.Field>
    </Form.Group>
    <Form.Field>
      <label>Name</label>
      <Form.Input
        name="name"
        value={formikProps.values.name}
        onChange={formikProps.handleChange}
      />
    </Form.Field>
    <Form.Field>
      <label>Description</label>
      <Form.Input
        name="description"
        value={formikProps.values.description}
        onChange={formikProps.handleChange}
      />
    </Form.Field>
    <Form.Group widths="equal">
      <Form.Field>
        <label>Email</label>
        <Form.Input
          name="email"
          value={formikProps.values.email}
          onChange={formikProps.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Website</label>
        <Form.Input
          name="website"
          value={formikProps.values.website}
          onChange={formikProps.handleChange}
        />
      </Form.Field>
    </Form.Group>
  </Form>
);

export default EditOrganizationForm;
