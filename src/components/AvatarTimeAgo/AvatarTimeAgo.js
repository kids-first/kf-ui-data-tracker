import React from 'react';
import PropTypes from 'prop-types';
import {Label, Popup} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import defaultAvatar from '../../assets/defaultAvatar.png';
import {longDate} from '../../common/dateUtils';
import {showuUserName} from '../../common/notificationUtils';

/**
 * Displays time ago and avatar in one label
 */
const AvatarTimeAgo = ({showUsername, creator, createdAt, size}) => {
  const picUrl = creator && creator.picture ? creator.picture : defaultAvatar;
  if (creator && showUsername) {
    return (
      <Label image size={size}>
        <img alt={showuUserName(creator)} src={picUrl} />
        {showuUserName(creator)}
        <Label.Detail>
          {createdAt ? (
            <TimeAgo
              date={createdAt}
              live={false}
              title={longDate(createdAt)}
            />
          ) : (
            'Unknown'
          )}
        </Label.Detail>
      </Label>
    );
  } else {
    return (
      <Popup
        inverted
        size={size}
        content={showuUserName(creator)}
        trigger={
          <Label image basic size={size}>
            <img alt={showuUserName(creator)} src={picUrl} />
            {createdAt ? (
              <TimeAgo
                date={createdAt}
                live={false}
                title={longDate(createdAt)}
              />
            ) : (
              'Unknown'
            )}
          </Label>
        }
      />
    );
  }
};

AvatarTimeAgo.propTypes = {
  /** User object contains username and picture */
  creator: PropTypes.object,
  /** If to show user name */
  showUsername: PropTypes.bool,
  /** Show as time ago */
  createdAt: PropTypes.string,
  /** Label size. */
  size: PropTypes.oneOf([
    'mini',
    'tiny',
    'small',
    'medium',
    'large',
    'big',
    'huge',
    'massive',
  ]),
};

export default AvatarTimeAgo;
