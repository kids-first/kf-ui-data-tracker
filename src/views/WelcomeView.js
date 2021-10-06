import React from 'react';
import {ImageMessage} from '../components/ImageMessage';
import welcome from '../assets/welcome.svg';

/**
 * Welcome message for users without ability to view studies
 */
const WelcomeView = () => (
  <ImageMessage
    image={welcome}
    title="Welcome to the Data Tracker!"
    message={
      <>
        You haven't been added to any organizations or studies yet. Please wait
        until an administrator adds you and grants you permissions or get in
        touch at{' '}
        <a href="mailto:support@kidsfirstdrc.org">support@kidsfirstdrc.org</a>
      </>
    }
  />
);

export default WelcomeView;
