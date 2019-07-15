import React from 'react';
import PropTypes from 'prop-types';
import {Label} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import defaultAvatar from '../../assets/defaultAvatar.png';
/**
 * Displays time ago and avatar in one label
 */
const AvatarTimeAgo = ({showUsername, creator, createdAt, size}) => {
  const picUrl = creator && creator.picture ? creator.picture : defaultAvatar;
  const picAlt = creator && creator.username ? creator.username : 'profile';
  if (creator && showUsername) {
    return (
      <Label image size={size}>
        <img alt={picAlt} src={picUrl} />
        {creator.username ? creator.username : 'unknown'}
        <Label.Detail>
          {createdAt ? <TimeAgo date={createdAt} live={false} /> : 'Unknown'}
        </Label.Detail>
      </Label>
    );
  } else {
    return (
      <Label image basic size={size}>
        <img alt={picAlt} src={picUrl} />
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
