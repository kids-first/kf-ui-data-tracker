import React from 'react';
import {Header, Loader, Comment, Icon, Image, Table} from 'semantic-ui-react';
import Markdown from 'react-markdown';
import {longDate} from '../../common/dateUtils';

const ReleaseList = ({loading, releases}) => {
  const coordUrl = process.env.REACT_APP_COORD_UI + 'releases/';

  if (loading) {
    return <Loader>Loading...</Loader>;
  }

  if (!loading && releases.length === 0) {
    return (
      <Header disabled textAlign="center" as="h4">
        No releases data available for current study.
      </Header>
    );
  }

  return (
    <Comment.Group size="large">
      {releases.map(r => (
        <Comment key={r.node.id}>
          <Comment.Avatar as={Icon} name="tag" />
          <Comment.Content>
            <Comment.Author
              className="text-blue"
              as="a"
              href={`${coordUrl + r.node.kfId}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {r.node.version + ' - ' + r.node.name + ' '}
              <Icon link size="small" name="external" />
            </Comment.Author>
            <Comment.Metadata>on {longDate(r.node.createdAt)}</Comment.Metadata>
            <Comment.Text>
              <Markdown
                source={r.node.description}
                renderers={{
                  image: Image,
                  table: props => <Table>{props.children}</Table>,
                }}
              />
            </Comment.Text>
          </Comment.Content>
        </Comment>
      ))}
    </Comment.Group>
  );
};

export default ReleaseList;
