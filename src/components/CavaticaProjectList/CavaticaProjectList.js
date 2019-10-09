import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'semantic-ui-react';
import CavaticaProjectItem from './CavaticaProjectItem';
/**
 * Displays Cavatica projects in a list format with the option to
 * show/hide edit and link button, and study links
 */
const CavaticaProjectList = ({
  projects,
  unlinkProject,
  editable,
  disableLink,
  hideStudy,
}) => (
  <List relaxed divided>
    {projects &&
      projects.length > 0 &&
      projects.map(({node}) => (
        <CavaticaProjectItem
          key={node.id}
          projectNode={node}
          unlinkProject={unlinkProject}
          editable={editable}
          disableLink={disableLink}
          hideStudy={hideStudy}
        />
      ))}
  </List>
);

CavaticaProjectList.propTypes = {
  /** Array of Cavatica projects object*/
  projects: PropTypes.array,
  /** Function to unlink the project from the study */
  unlinkProject: PropTypes.func,
  /** If allow user to see the edit button */
  editable: PropTypes.bool,
  /** If disable the link going to Cavatica */
  disableLink: PropTypes.bool,
  /** If hide the study which current project links to */
  hideStudy: PropTypes.bool,
};

export default CavaticaProjectList;
