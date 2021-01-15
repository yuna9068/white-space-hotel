module.exports = {
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