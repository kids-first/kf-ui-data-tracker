import jwtDecode from 'jwt-decode';

export const hasToken = () => {
  const token = localStorage.getItem('egoToken');
  if (token == null) {
    return false;
  }
  const user = jwtDecode(token).context.user;
  return (
    user.status === 'Approved' &&
    jwtDecode(token).exp > Math.floor(new Date().getTime() / 1000)
  );
};
