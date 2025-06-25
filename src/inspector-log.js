module.exports = inspectorLog

// black hole
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nullStream = new (require('stream').Writable)()
nullStream._write = () => {}

/**
 * Outputs a `console.log()` to the Node.js Inspector console *only*.
 */
function inspectorLog() {
  const stdout = console._stdout
  console._stdout = nullStream
  console.log.apply(console, arguments)
  console._stdout = stdout
}
