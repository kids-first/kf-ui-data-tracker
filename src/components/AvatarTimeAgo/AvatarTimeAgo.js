import React from 'react';
import PropTypes from 'prop-types';
import {Label} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
/**
 * Displays time ago and avatar in one label
 */
const AvatarTimeAgo = ({showUsername, creator, createdAt, size}) => {
  if (showUsername) {
    return (
      <Label image size={size}>
        {creator && (
          <img
            alt={creator.username || 'unknown'}
            src={
              creator.picture || 'https://www.w3schools.com/css/img_avatar.png'
            }
          />
        )}
        {creator && showUsername && creator.username}
        <Label.Detail>
          {createdAt ? <TimeAgo date={createdAt} live={false} /> : 'Unknown'}
        </Label.Detail>
      </Label>
    );
  } else {
    return (
      <Label image basic size={size}>
        {creator && (
          <img
            alt={creator.username || 'unknown'}
            src={
              creator.picture || 'https://www.w3schools.com/css/img_avatar.png'
            }
          />
        )}
        {createdAt ? <TimeAgo date={createdAt} live={false} /> : 'Unknown'}
      </Label>
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
