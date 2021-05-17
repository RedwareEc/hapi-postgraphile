// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');
import consola from 'consola';
export const logger = consola.withScope(pkg.name);
export const dependencies = {};
export { pkg };
/**
 *
 */
