import {getPermissions, hasPermission, hasPermissions} from '../permissions';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';

it('gets user permissions', () => {
  const user = myProfile.data.myProfile;

  const permissions = getPermissions(user);
  expect(permissions).toContain('link_bucket');
  expect(permissions).toContain('delete_version');
});

it('user has permission', () => {
  const user = myProfile.data.myProfile;

  expect(hasPermission(user, 'link_bucket')).toBe(true);
  expect(hasPermission(user, 'asd_aoe')).toBe(false);
});

it('user has permissions', () => {
  const user = myProfile.data.myProfile;

  expect(hasPermissions(user, ['link_bucket'])).toBe(true);
  expect(hasPermissions(user, ['asd_aoe'])).toBe(false);
  expect(hasPermissions(user, ['link_bucket', 'asd_aoe'])).toBe(false);
  expect(hasPermissions(user, ['link_bucket', 'view_study'])).toBe(true);
});
