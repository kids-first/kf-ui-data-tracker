import React from 'react';
import {List} from 'semantic-ui-react';
import CavaticaProjectItem from './CavaticaProjectItem';

const CavaticaProjectList = ({
  projects,
  unlinkProject,
  disableLink,
  hideStudy,
}) => (
  <List relaxed divided>
    {projects
      .sort(({node}) => node.name)
      .map(({node}) => (
        <CavaticaProjectItem
          key={node.id}
          projectNode={node}
          unlinkProject={unlinkProject}
          disableLink={disableLink}
          hideStudy={hideStudy}
        />
      ))}
  </List>
);

export default CavaticaProjectList;
