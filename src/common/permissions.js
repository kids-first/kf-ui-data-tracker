export const getPermissions = user => {
  const permissions = user.groups.edges
    .map(({node}) => node.permissions.edges.map(({node}) => node.codename))
    .reduce((a, b) => [...a, ...b], []);
  return permissions;
};

/*
 * Checks if a given user has a specificed permission in one of their groups
 */
export const hasPermission = (user, permission) => {
  const permissions = getPermissions(user);
  return permissions.includes(permission);
};

/*
 * Checks if a given user has all the given permissions
 */
export const hasPermissions = (user, permissions) => {
  const userPermissions = getPermissions(user);
  return permissions.every(perm => userPermissions.includes(perm));
};
