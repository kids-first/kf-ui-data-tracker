import React from 'react';
import {Link} from 'react-router-dom';
import {List, Icon} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';

const CavaticaProjectList = ({projects}) => (
  <List relaxed divided>
    {projects.map(({node}) => (
      <List.Item key={node.id}>
        <Icon name={node.projectType === 'DEL' ? 'truck' : 'dna'} />
        <List.Content>
          <List.Content floated="right">
            {node.study ? (
              <Link to={`/studies/${node.study.kfId}`}>
                {node.study.shortName || node.study.name || node.study.kfId}
              </Link>
            ) : (
              'Not linked'
            )}
          </List.Content>
          <List.Header
            as="a"
            href={`https://cavatica.sbgenomics.com/u/${node.projectId}`}
          >
            {node.name + ' '}
            <Icon link size="small" name="external" />
          </List.Header>
          {node.creator && <>Created by {node.creator.username} </>}
          <List bulleted horizontal>
            <List.Item>
              Created <TimeAgo live={false} date={node.createdOn} />
            </List.Item>
            <List.Item>{node.workflowType}</List.Item>
            <List.Item>
              <code>{node.projectId}</code>
            </List.Item>
          </List>
        </List.Content>
      </List.Item>
    ))}
  </List>
);

export default CavaticaProjectList;
