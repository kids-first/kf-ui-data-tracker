import {Button, Grid, Icon, List, Popup} from 'semantic-ui-react';
import React, {Fragment} from 'react';

import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import {eventType} from '../../common/enums';
import {longDate} from '../../common/dateUtils';

/**
 * Highlights any kf_ids in the description and turns them into links
 * If the study, file, or version does not exist, no highlighting will be
 * applied.
 */
const linkDescription = node => {
  // If no study, it must have been deleted including any files or versions
  if (!node.study) return node.description;

  const ids = {
    SD: node.study && node.study.kfId,
    SF: node.file && node.file.kfId,
    FV: node.version && node.version.kfId,
  };

  const urls = {
    SD: `/study/${ids.SD}/basic-info/info`,
    SF: `/study/${ids.SD}/documents/${ids.SF}`,
    FV: `/study/${ids.SD}/documents/${ids.SF}`,
  };

  const EntityLink = ({entityType}) => (
    <Link to={urls[entityType]} key={ids[entityType]}>
      {ids[entityType] + ' '}
    </Link>
  );

  const entityPattern = /((SD|SF|FV)_\w{8})/g;
  const matches = node.description.split(entityPattern);
  var parts = [];
  for (var i = 0; i < matches.length; i += 3) {
    const link =
      matches[i + 2] in ids && ids[matches[i + 2]] ? (
        <EntityLink key={i + matches[i + 2]} entityType={matches[i + 2]} />
      ) : (
        matches[i + 1]
      );
    parts = [...parts, matches[i], link];
  }

  return parts;
};

/**
 * Event list is used to display user activities
 * Consisted with three parts:
 * - Color-coded icon indication action type
 * - Text descrbing who did what
 * - Timeago text indication when the action happened
 */
const EventList = ({events, referralTokenData}) => {
  const StudyPopup = ({event}) => {
    var token = [];
    if (event.eventType === 'RT_CRE') {
      token =
        referralTokenData.length > 0 &&
        referralTokenData.filter(
          ({node}) =>
            node.createdBy &&
            event.user &&
            node.createdBy.id === event.user.id &&
            node.email ===
              event.description.match(
                /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
              )[0] &&
            node.createdAt.split('T')[0] === event.createdAt.split('T')[0],
        );
    }
    if (event.eventType === 'RT_CLA') {
      token =
        referralTokenData.length > 0 &&
        referralTokenData.filter(
          ({node}) =>
            node.claimedBy && event.user && node.claimedBy.id === event.user.id,
        );
    }
    var splitList = [[], [], []];
    if (token.length > 0 && token[0].node.studies.edges.length > 0) {
      const n = 3;
      const wordsPerLine = Math.ceil(token[0].node.studies.edges.length / 3);
      for (let line = 0; line < n; line++) {
        for (let i = 0; i < wordsPerLine; i++) {
          const value = token[0].node.studies.edges[i + line * wordsPerLine];
          if (!value) continue;
          splitList[line].push(value);
        }
      }
    }

    return (
      <Popup
        wide="very"
        disabled={
          token.length === 0 || token[0].node.studies.edges.length === 0
        }
        trigger={
          <Button
            labelPosition="left"
            className={
              token.length > 0 && token[0].node.studies.edges.length > 0
                ? 'text-primary text-normal text-14'
                : 'text-black text-normal text-14'
            }
          >
            {token.length > 0 && token[0].node.studies.edges.length > 0
              ? token[0].node.studies.edges.length +
                (token[0].node.studies.edges.length > 1 ? ' studies' : ' study')
              : 'studies'}
          </Button>
        }
        content={
          <Grid columns={3}>
            {[0, 1, 2].map(i => (
              <Fragment key={i}>
                {splitList[i].length > 0 &&
                  splitList[i].map(({node}) => (
                    <Grid.Column
                      className="pt-5 pb-5"
                      key={node.kfId}
                      as={Link}
                      target="_blank"
                      to={`/study/${node.kfId}/basic-info/info`}
                    >
                      {node.kfId}
                    </Grid.Column>
                  ))}
              </Fragment>
            ))}
          </Grid>
        }
        on={['click']}
      />
    );
  };

  return (
    <List relaxed="very">
      {events &&
        events.length > 0 &&
        events.map(({node}) => (
          <List.Item key={node.id} data-testid="event-item">
            <Icon
              name={
                node.eventType in eventType
                  ? eventType[node.eventType].iconName
                  : eventType.OTH.iconName
              }
              color={
                node.eventType in eventType
                  ? eventType[node.eventType].iconColor
                  : eventType.OTH.iconColor
              }
            />
            <List.Content>
              <List.Content floated="right">
                <TimeAgo
                  live={false}
                  date={node.createdAt}
                  title={longDate(node.createdAt)}
                />
              </List.Content>

              {node.eventType === 'RT_CRE' || node.eventType === 'RT_CLA' ? (
                <>
                  {node.description.split(' to ')[0] + ' to '}
                  <StudyPopup event={node} />
                </>
              ) : (
                <>{linkDescription(node)}</>
              )}
            </List.Content>
          </List.Item>
        ))}
    </List>
  );
};

EventList.propTypes = {
  /** Array of event object*/
  eventList: PropTypes.array,
};

EventList.defaultProps = {
  eventList: [],
};

export default EventList;
