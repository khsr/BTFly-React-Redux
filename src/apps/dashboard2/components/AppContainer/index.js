if (process.env.NODE_ENV === 'production') {
  module.exports = require('react-hot-loader/lib/AppContainer.prod')
} else {
  module.exports = require('./AppContainer.dev')
}
