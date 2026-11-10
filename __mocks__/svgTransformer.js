const path = require('path')

module.exports = {
  process(src, filePath) {
    const name = path.basename(filePath, '.svg').replace(/[^a-zA-Z0-9]/g, '_')
    return {
      code: `const React = require('react'); function ${name}(props) { return React.createElement('svg', props); } module.exports = ${name};`,
    }
  },
}
