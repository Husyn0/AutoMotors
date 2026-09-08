// craco.config.js
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source maps in production
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.devtool = false;
        
        // Remove console.logs in production
        const TerserPlugin = webpackConfig.optimization.minimizer.find(
          (plugin) => plugin.constructor.name === 'TerserPlugin'
        );
        
        if (TerserPlugin) {
          TerserPlugin.options.terserOptions.compress.drop_console = true;
        }
      }
      
      return webpackConfig;
    }
  }
};