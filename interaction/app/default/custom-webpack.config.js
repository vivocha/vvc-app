module.exports = (config, options) => {
  config.resolve.alias['@vivocha/public-entities/dist/wrappers/data_collection'] = '@vivocha/public-entities/dist/es5/wrappers/data_collection';
  return config;
};