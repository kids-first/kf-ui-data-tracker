// Reformat time to the "DD MMM YYYY" format like "12 Aug 2019"
export const longDate = date => {
  var mydate = new Date(date);
  var month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ][mydate.getMonth()];
  var str = mydate.getUTCDate() + ' ' + month + ' ' + mydate.getFullYear();
  return str;
};

export const toYearMonthDay = isoDate => {
  /*
   * Convert ISO8601 UTC datetime string to local datetime and format as
   * yyyy-mm-dd date string.
   * HTML input type=date requires the yyyy-mm-dd format
   */
  let date = '';
  if (isoDate) {
    date = new Date(isoDate);
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    date = [year, month, day].join('-');
  }
  return date;
};

// Reformat time to the date and time format
export const dateTime = date => {
  var mydate = new Date(date);
  var month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ][mydate.getMonth()];
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var str =
    weekday[mydate.getDay()] +
    ', ' +
    month +
    ' ' +
    mydate.getUTCDate() +
    ', ' +
    mydate.getFullYear() +
    ', ' +
    mydate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  return str;
};
