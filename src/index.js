/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  module.exports = require('./browser.js')
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  module.exports = require('./node.js')
}
