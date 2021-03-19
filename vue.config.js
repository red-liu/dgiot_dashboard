/**
 * @description vue.config.js全局配置
 */
const path = require('path')
const {
  baseURL,
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  abbreviation,
  devPort,
  providePlugin,
  build7z,
  buildGzip,
  imageCompression,
  proxyUrl,
  webpackBanner,
  webpackBarName,
  staticUrl,
} = require('./src/config')
const rely = require('vue-plugin-rely')
const { version, author } = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const dateTime = new Date()
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['html', 'js', 'css', 'svg']
process.env.VUE_APP_TITLE = title
process.env.VUE_APP_AUTHOR = author
process.env.VUE_APP_UPDATE_TIME = dateTime
process.env.VUE_APP_VERSION = version
process.env.VUE_APP_RELY = rely
process.env.VUE_APP_server = proxyUrl.server
process.env.VUE_APP_imgserver = proxyUrl.imgurl
process.env.VUE_APP_Prometheus = proxyUrl.PrometheusUrl
process.env.VUE_APP_toppanDocx = proxyUrl.toppanDocx
process.env.VUE_APP_Keywords = 'zete--Keywords'
process.env.VUE_APP_Description = 'zete--description'
const resolve = (dir) => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: {
      [baseURL]: {
        target: process.env.VUE_APP_server,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          ['^' + baseURL]: '',
        },
      },

      '/imgurl': {
        target: process.env.VUE_APP_imgserver,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/imgurl': '',
        },
      },
      '/PrometheusUrl': {
        target: process.env.VUE_APP_Prometheus,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/PrometheusUrl': '',
        },
      },
      '/toppanDocx': {
        target: process.env.VUE_APP_toppanDocx,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/toppanDocx': '',
        },
      },
    },
  },
  configureWebpack() {
    // https://blog.csdn.net/weixin_43972992/article/details/105159723
    return {
      externals: {
        'js-md5': 'md5',
        'js-base64': 'Base64',
        $: 'jquery',
        ace: 'ace',
        mqtt: 'mqtt',
        'paho-mqtt': 'paho',
        Sortable: 'Sortable',
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        clipboard: 'clipboard',
        lodash: 'lodash',
        'vue-i18n': 'VueI18n',
        XLSX: 'xlsx',
        FileSaver: 'file-saver',
        'js-cookie': 'Cookies',
        'vue-baidu-map': 'BaiduMap',
        echarts: 'echarts',
        screenfull: 'screenfull',
        qs: 'qs',
        moment: 'moment',
        jsplumb: 'jsplumb',
        JSEncrypt: 'jsencrypt',
        CodeMirror: 'codemirror',
        nprogress: 'NProgress',
        'vue-codemirror': 'vueCodemirror',
        vuedraggable: 'vuedraggable',
        'element-china-area-data': 'elementChinaAreaData',
      },
      resolve: {
        alias: {
          '@': resolve('src'),
          '*': resolve(''),
        },
      },
      plugins: [
        new Webpack.ProvidePlugin(providePlugin),
        new WebpackBar({
          name: webpackBarName,
        }),
      ],
    }
  },
  chainWebpack(config) {
    config.plugin('html').tap((args) => {
      args[0].staticUrl = staticUrl
      return args
    })
    config.resolve.symlinks(true)
    config.module.rule('svg').exclude.add(resolve('src/icon'))
    config.module
      .rule('vabIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'vab-icon-[name]' })
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.devtool('source-map')
    })
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.performance.set('hints', false)
      config.devtool('none')
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'dgiot-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
          },
          elementUI: {
            name: 'dgiot-element-ui',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
        },
      })
      config
        .plugin('banner')
        .use(Webpack.BannerPlugin, [`${webpackBanner}${dateTime}`])
      if (imageCompression)
        config.module
          .rule('images')
          .use('image-webpack-loader')
          .loader('image-webpack-loader')
          .options({
            bypassOnDebug: true,
          })
          .end()
      if (buildGzip)
        config.plugin('compression').use(CompressionWebpackPlugin, [
          {
            filename: '[path][base].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
              '\\.(' + productionGzipExtensions.join('|') + ')$'
            ),
            threshold: 8192,
            minRatio: 0.8,
          },
        ])
      if (build7z)
        config.plugin('fileManager').use(FileManagerPlugin, [
          {
            onEnd: {
              archive: [
                {
                  source: `./${outputDir}`,
                  destination: `./${outputDir}/${abbreviation}_${dateTime}.7z`,
                },
              ],
            },
          },
        ])
    })
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext
          const relativePath = path.relative(rootContext, resourcePath)
          if (
            relativePath.replace(/\\/g, '/') !==
            'src/vab/styles/variables/variables.scss'
          )
            return '@import "~@/vab/styles/variables/variables.scss";' + content
          return content
        },
      },
    },
  },
}
