const isActive = banner => {
  /* 
    Banner is active if it is enabled && 
    start date <= today && end date is after today 
    or end date is null
    */
  if (!banner.enabled) {
    return false;
  }
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

const activeDisplayBanners = banners => {
  /*
   * Display the 2 newest (by start date) banners
   * */
  return banners
    .map(banner => banner.node)
    .filter(banner => isActive(banner))
    .sort((a, b) => a.startDate - b.startDate)
    .slice(0, 2);
};

export default activeDisplayBanners;
