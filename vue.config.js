module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/white-space-hotel/'
    : '/',
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'White Space Hotel'; // eslint-disable-line no-param-reassign
        return args;
      });
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/assets/style/_variables.sass"
          @import "~@/assets/style/_mixins.sass"
          @import "~@/assets/style/_breakpoint.sass"`,
      },
    },
  },
};
