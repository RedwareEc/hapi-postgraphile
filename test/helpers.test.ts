import { buildPaths } from '../src/helpers';
const simple = buildPaths('Users');
const complex = buildPaths('BkCostCenters');

test('buildPaths:create', () => {
  expect(simple.create()).toEqual('/users');
  expect(complex.create()).toEqual('/bk-cost-centers');
});
