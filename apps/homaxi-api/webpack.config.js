const { composePlugins, withNx } = require('@nx/webpack')
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin')

module.exports = composePlugins(
  withNx(),
  (config) => {
    config.plugins.push(
      new NxAppWebpackPlugin({
        generatePackageJson: true
      })
    )
    return config
  }
);
