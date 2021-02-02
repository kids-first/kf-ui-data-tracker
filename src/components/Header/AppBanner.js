import React from 'react';
import {Icon, Segment} from 'semantic-ui-react';
import {useQuery} from '@apollo/client';
import {ALL_BANNERS} from '../../admin/queries';
import activeDisplayBanners from '../../admin/common/bannerUtils';

const AppBanner = () => {
  const {loading, error, data} = useQuery(ALL_BANNERS, {
    variables: {enabled: true},
  });
  const iconMap = {
    INFO: 'info circle',
    WARN: 'warning circle',
    ERROR: 'times circle',
  };

  if ((!loading || !error) && data && data.allBanners.edges.length > 0) {
    const displayBanners = activeDisplayBanners(data.allBanners.edges);

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
