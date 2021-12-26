import { Runway } from './runway.mjs';

/**
 * Command-line demo using node.js.
 * 
 * @example <caption>Calculate time elapsed with inflation at 2%, yearly withdrawal rate of 25k, initial balance of 100k, and ending balance of 10k</caption>
 * node .\demo.js -0.02 25000 100000 10000
 */

const args = process.argv.slice(2);
Runway.printCalcs(args[0], args[1], args[2], args[3]);