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
