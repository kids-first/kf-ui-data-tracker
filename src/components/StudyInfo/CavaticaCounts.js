import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {List, Popup} from 'semantic-ui-react';
import {projectOptions} from '../../common/enums';
import CavaticaLogo from '../../assets/CavaticaLogo';
/**
 * Displays project counts with total number and breaking down by each type
 * When no projects exist, show buttons guiding user to add/link projects
 */
const CavaticaCounts = ({
  projects,
  title,
  hideIcon,
  wrap,
  isResearch,
  showWarning,
}) => {
  const types = projects.map(({node: {projectType}}) => projectType);
  const typeCounts = types.reduce((count, type) => {
    count[type] = (count[type] || 0) + 1;
    return count;
  }, {});
  return (
    <>
      <Link
        to={
          isResearch
            ? `/research-study/${title}/cavatica`
            : `/study/${title}/cavatica`
        }
        onClick={e => e.stopPropagation()}
        className={
          hideIcon && projects.length === 0 && showWarning ? 'text-red' : null
        }
      >
        {!hideIcon && (
          <CavaticaLogo
            className="mr-5 vertical-middle"
            fill={
              projects.length === 0 && showWarning
                ? '#db2828'
                : 'rgba(0,0,0,.6)'
            }
          />
        )}
        {projects.length > 0 ? projects.length : 'No'} projects
      </Link>
      <List horizontal className={wrap ? 'display-block' : 'ml-15'}>
        {projectOptions.map(
          type =>
            type.value in typeCounts && (
              <Popup
                inverted
                position="top center"
                size="small"
                content={type.text}
                key={type.key}
                trigger={
                  <List.Item>
                    <List.Icon name={type.icon} />
                    {typeCounts[type.key]}
                  </List.Item>
                }
              />
            ),
        )}
      </List>
    </>
  );
};

CavaticaCounts.propTypes = {
  /** Array of project object*/
  projects: PropTypes.array.isRequired,
  /** Study id used by forming the redirect url*/
  title: PropTypes.string.isRequired,
};

CavaticaCounts.defaultProps = {
  projects: [],
};

export default CavaticaCounts;
