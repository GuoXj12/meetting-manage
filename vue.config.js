const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
        Object.assign(definitions[0]['process.env'], {
          NODE_HOST: '"http://localhost:8888"',
            //NODE_HOST: '"http://8.141.76.133:8888"',

        });
        return definitions;
    });
  }
})
