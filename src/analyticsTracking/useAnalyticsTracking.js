import {useContext} from 'react';
import AnalyticsTrackingContext from './AnalyticsTrackingContext';

const useAnalyticsTracking = () => {
  const constants = useContext(AnalyticsTrackingContext);

  return {
    ...constants,
  };
};
export default useAnalyticsTracking;
