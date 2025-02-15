module.exports = function override(config, env) {
    // Enable handling of .mjs files
    config.resolve.extensions.push('.mjs');
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    return config;
  };