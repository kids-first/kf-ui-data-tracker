import React from 'react';
import {Icon, Segment} from 'semantic-ui-react';
import {useQuery} from '@apollo/client';
import {ALL_BANNERS} from '../../admin/queries';

const AppBanner = () => {
  const {loading, error, data} = useQuery(ALL_BANNERS, {
    variables: {enabled: true},
  });
  const iconMap = {
    INFO: 'info circle',
    WARN: 'warning circle',
    ERROR: 'times circle',
  };

  const isActive = banner => {
    /* 
    Banner is active if it is enabled && 
    start date <= today && end date is after today 
    or end date is null
    */
    // Set today to localtime midnight
    const today = new Date().setHours(0, 0, 0, 0);
    if (banner.startDate && banner.endDate) {
      return (
        Date.parse(banner.startDate) <= today &&
        Date.parse(banner.endDate) > today
      );
    } else if (banner.startDate) {
      return Date.parse(banner.startDate) <= today;
    } else {
      return false;
    }
  };

  if ((!loading || !error) && data && data.allBanners.edges.length > 0) {
    const banners = data.allBanners.edges
      .map(banner => banner.node)
      .filter(banner => isActive(banner));
    const displayBanners = banners
      .slice(0, 2)
      .sort((a, b) => a.startDate - b.startDate);

    return (
      displayBanners.length > 0 && (
        <Segment inverted basic color="pink" className="noMargin pt-5 pb-5">
          {displayBanners.map(banner => (
            <Segment
              key={banner.id}
              inverted
              basic
              textAlign="center"
              color="pink"
              className="noMargin pt-5 pb-5"
            >
              <Icon
                size="large"
                name={iconMap[banner.severity] || 'info circle'}
              />
              {banner.message}
              {banner.url && (
                <span className="app-banner-link">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={banner.url}
                  >
                    See {banner.urlLabel || 'more info here'}
                  </a>
                </span>
              )}
            </Segment>
          ))}
        </Segment>
      )
    );
  } else {
    return null;
  }
};

export default AppBanner;
