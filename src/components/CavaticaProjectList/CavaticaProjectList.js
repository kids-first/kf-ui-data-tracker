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
  importVolumeFiles,
  editable,
  disableLink,
  showLinkButton,
}) => (
  <List relaxed divided>
    {projects &&
      projects.length > 0 &&
      projects
        .sort(({node: p1}, {node: p2}) => {
          if (p1.deleted !== p2.deleted) {
            // Sort deleted projects to the bottom
            return p1.deleted ? 1 : -1;
          } else if (!p1.study || !p2.study) {
            if (p1.study === p2.study) {
              // Sort by project name
              return p1.projectId.localeCompare(p2.projectId);
            }
            // Sort unlinked projects toward the bottom
            if (p1.study === null) {
              return 1;
            } else if (p2.study === null) {
              return -1;
            }
          }
          // Sort by the linked study's name
          return p1.study.name.localeCompare(p2.study.name);
        })
        .map(({node}) => (
          <CavaticaProjectItem
            key={node.id}
            projectNode={node}
            unlinkProject={unlinkProject}
            editable={editable}
            disableLink={disableLink}
            importVolumeFiles={importVolumeFiles}
            showLinkButton={showLinkButton}
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
};

export default CavaticaProjectList;
