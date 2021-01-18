module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'White Space Hotel'
        return args
      })
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/assets/style/_variables.sass"
          @import "~@/assets/style/_mixins.sass"
          @import "~@/assets/style/_breakpoint.sass"`
      }
    }
  }
}