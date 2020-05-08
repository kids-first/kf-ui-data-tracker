import {compareSemVer} from '../sortUtils';

it('sorts versions correctl', () => {
  const versions = ['2.0.0', '1.12.0', '1.1.4', '4.50.0', '0.4.1', '0.4.12'];

  const sortedVersions = versions.sort(compareSemVer);

  expect(sortedVersions).toStrictEqual([
    '0.4.1',
    '0.4.12',
    '1.1.4',
    '1.12.0',
    '2.0.0',
    '4.50.0',
  ]);
});
