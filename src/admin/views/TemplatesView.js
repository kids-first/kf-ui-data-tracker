import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {Link} from 'react-router-dom';
import {ALL_TEMPLATE_VERSIONS} from '../../state/queries';
import {
  Button,
  Container,
  Grid,
  Header,
  List,
  Icon,
  Message,
  Segment,
  Placeholder,
} from 'semantic-ui-react';
import TemplateList from '../../components/TemplateList/TemplateList';

const TemplatesView = () => {
  const {loading, data, error} = useQuery(ALL_TEMPLATE_VERSIONS);
  const allTemplates = data && data.allTemplateVersions;
  console.log(allTemplates);

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Templates</title>
      </Helmet>
      <Header as="h2">
        Manage Data Templates
        <Header.Subheader>
          Organization administrators can create data submission templates to
          standardize how data is data collected for their studies.
        </Header.Subheader>
      </Header>
      <Segment basic vertical>
        {error && (
          <Message
            negative
            icon="warning circle"
            header="Error"
            content={error.message}
          />
        )}
        {allTemplates && allTemplates.edges.length > 0 ? (
          <TemplateList templates={allTemplates.edges} />
        ) : (
          <Header disabled textAlign="center" as="h4">
            No data templates available
          </Header>
        )}
      </Segment>
    </Container>
  );
};

export default TemplatesView;
