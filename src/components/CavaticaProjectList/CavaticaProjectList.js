import React from 'react';
import {List} from 'semantic-ui-react';
import CavaticaProjectItem from './CavaticaProjectItem';

const CavaticaProjectList = ({
  projects,
  unlinkProject,
  studyId,
  disableLink,
}) => (
  <List relaxed divided>
    {projects
      .sort(({node}) => node.name)
      .map(({node}) => (
        <CavaticaProjectItem
          key={node.id}
          projectNode={node}
          unlinkProject={unlinkProject}
          studyId={studyId}
          disableLink={disableLink}
        />
      ))}
  </List>
);

export default CavaticaProjectList;
