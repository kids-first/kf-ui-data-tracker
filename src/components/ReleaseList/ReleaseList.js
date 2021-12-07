import React from 'react';
import {Header, Loader, Comment, Icon, Image, Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import Markdown from 'react-markdown';
import {longDate} from '../../common/dateUtils';

const ReleaseList = ({loading, releases}) => {
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
            <Comment.Author className="display-inline">
              <Link
                className="text-blue"
                to={'/releases/history/' + r.node.kfId}
              >
                {r.node.version + ' - ' + r.node.name + ' '}
              </Link>
            </Comment.Author>
            <Comment.Metadata className="text-12">
              on {longDate(r.node.createdAt)}
            </Comment.Metadata>
            <Comment.Text>
              <Markdown
                source={r.node.description}
                renderers={{
                  image: Image,
                  table: props => <Table>{props.children}</Table>,
                }}
                linkTarget="_blank"
              />
            </Comment.Text>
          </Comment.Content>
        </Comment>
      ))}
    </Comment.Group>
  );
};

export default ReleaseList;
