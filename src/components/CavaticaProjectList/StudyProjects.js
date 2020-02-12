import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Accordion, Divider, Header, Icon, List} from 'semantic-ui-react';
import CavaticaProjectItem from './CavaticaProjectItem';

const projectSort = ({node: p1}, {node: p2}) => {
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
};

/**
 * Display a list of Cavatica projects for a given study
 */
const StudyProjects = ({
  study,
  projects,
  unlinkProject,
  importVolumeFiles,
  editable,
  disableLink,
}) => {
  const [active, setActive] = useState(!study);

  const handleClick = (e, title) => {
    console.log(active);
    setActive(!active);
  };

  return (
    <>
      <Accordion.Title active={active} onClick={handleClick}>
        <Header size="medium">
          <Icon name="dropdown" />
          {study ? (
            <>
              ({projects.length}){' '}
              <Link to={`/study/${study.kfId}/cavatica`}>{study.kfId}</Link> -{' '}
              {study.name}
            </>
          ) : (
            <>({projects.length}) Unlinked Projects</>
          )}
          <Header sub floated="right">
            Click to {active ? 'Collapse' : 'Expand'}
          </Header>
        </Header>
      </Accordion.Title>
      <Accordion.Content active={active}>
        <List relaxed divided>
          {projects &&
            projects.length > 0 &&
            projects
              .sort(projectSort)
              .map(({node}) => (
                <CavaticaProjectItem
                  key={node.id}
                  projectNode={node}
                  unlinkProject={unlinkProject}
                  editable={editable}
                  disableLink={disableLink}
                  importVolumeFiles={importVolumeFiles}
                />
              ))}
        </List>
      </Accordion.Content>
      <Divider />
    </>
  );
};

StudyProjects.propTypes = {
  /** The study node */
  study: PropTypes.object,
  /** Array of Cavatica projects object*/
  projects: PropTypes.array,
  /** Function to unlink the project from the study */
  unlinkProject: PropTypes.func,
  /** If allow user to see the edit button */
  editable: PropTypes.bool,
  /** If disable the link going to Cavatica */
  disableLink: PropTypes.bool,
};

export default StudyProjects;
