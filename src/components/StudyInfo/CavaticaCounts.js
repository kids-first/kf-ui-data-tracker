import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {List, Popup, Label} from 'semantic-ui-react';
import {projectOptions} from '../../common/enums';
import CavaticaLogo from '../../assets/CavaticaLogo';
import {withAnalyticsTracking} from '../../analyticsTracking';
/**
 * Displays project counts with total number and breaking down by each type
 * When no projects exist, show buttons guiding user to add/link projects
 */
const CavaticaCounts = ({
  projects,
  title,
  hideIcon,
  tracking: {buttonTracking, popupTracking, logEvent, inheritedEventProps},
}) => {
  const types = projects.map(({node: {projectType}}) => projectType);
  const typeCounts = types.reduce((count, type) => {
    count[type] = (count[type] || 0) + 1;
    return count;
  }, {});
  return (
    <List horizontal>
      <List.Item
        as={Link}
        to={`/study/${title}/cavatica`}
        onClick={e => {
          e.stopPropagation();
          logEvent(
            inheritedEventProps.scope
              ? inheritedEventProps.scope + '__TOOLTIP_PROJECTS__CLICK'
              : 'TOOTLIP_PROJECTS__CLICK',
            {
              tooltip_name: 'Projects',
              tooltip_content: `${
                projects.length > 0 ? projects.length : 'No'
              } Projects`,
              link: `/study/${title}/cavatica`,
            },
          );
        }}
        className={hideIcon && projects.length === 0 ? 'text-red' : null}
        {...buttonTracking({
          button_text: `${
            projects.length > 0 ? projects.length : 'No'
          } projects`,
          button_type: 'text link',
          link: `/study/${title}/cavatica`,
        })}
      >
        {!hideIcon && (
          <CavaticaLogo
            className="mr-5 vertical-middle"
            fill={
              projects && projects.length > 0 ? 'rgba(0,0,0,.6)' : '#db2828'
            }
          />
        )}
        {projects.length > 0 ? projects.length : 'No'} projects
      </List.Item>
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
                <List.Item
                  {...popupTracking({
                    name: typeCounts[type.key],
                    content: type.text,
                  })}
                >
                  <Label circular empty size="mini" color="olive" />{' '}
                  {typeCounts[type.key]}
                </List.Item>
              }
            />
          ),
      )}
    </List>
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

export default withAnalyticsTracking(CavaticaCounts);
