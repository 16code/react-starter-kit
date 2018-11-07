const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const distPath = path.join(__dirname, 'dist');
const cachePath = path.join(__dirname, '.cache');
const srcPath = path.join(__dirname, 'src');
const publicPath = path.join(__dirname, 'public');
const stylePath = path.join(__dirname, 'src/styles');
const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 8181;

const filesNameMapper = {
    filename: isDev ? '[name].js' : 'assets/js/[name].[chunkhash:5].js',
    chunkFilename: isDev ? '[name].chunk.js' : 'assets/js/[name].[chunkhash:5].chunk.js',
    cssFilename: isDev ? '[name].css' : 'assets/css/[name].[chunkhash:5].css',
    cssChunkFilename: isDev ? '[id].css' : 'assets/css/[name].[chunkhash:5].css',
    imgFilename: 'assets/images/[name].[hash:5].[ext]',
    fontFilename: 'assets/fonts/[name].[ext]?[hash:5]'
};
const plugins = [
    new webpack.DefinePlugin({
        __DEV__: isDev,
        APP_NAME: '"后台管理系统"'
    }),
    new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        filename: 'index.html',
        title: 'React Starter Kit',
        inject: 'body',
        minify: {
            minifyJS: true,
            minifyCSS: true,
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.ProvidePlugin({
        React: 'react',
        ReactDOM: 'react-dom',
        moment: 'moment',
        classNames: 'classnames',
        asyncComponent: ['AsyncComponent', 'default']
    }),
    new MiniCssExtractPlugin({
        filename: filesNameMapper.cssFilename,
        chunkFilename: filesNameMapper.cssChunkFilename
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
];
const productionPlugins = [
    new BundleAnalyzerPlugin({ openAnalyzer: false }),
    new CleanWebpackPlugin([distPath]),
    new webpack.NoEmitOnErrorsPlugin(),
    new UglifyJSPlugin({
        cache: path.join(cachePath, 'uglifycache'),
        sourceMap: true,
        parallel: true,
        uglifyOptions: {
            ecma: 5,
            output: {
                comments: /webpackChunkName/,
                beautify: false
            },
            compress: {
                drop_console: true,
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            }
        }
    }),
    new CompressionPlugin({
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        threshold: 10240
    })
];
const entry = {
    vendors: ['./src/vendors.js'],
    app: ['./src/index.jsx', './src/styles/index.less']
};
module.exports = function config() {
    if (isDev) {
        plugins.push(
            ...[
                new webpack.NamedModulesPlugin(),
                new StyleLintPlugin({
                    configFile: path.join(__dirname, '.stylelintrc'),
                    files: ['**/*.less', '**/*.css']
                })
            ]
        );
        entry.app.unshift('react-hot-loader/patch');
    } else {
        plugins.push(...productionPlugins);
    }
    return {
        mode: isDev ? 'development' : 'production',
        entry,
        output: {
            path: distPath,
            filename: filesNameMapper.filename,
            chunkFilename: filesNameMapper.chunkFilename,
            publicPath: '/'
        },
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://0.0.0.0:3000/api',
                    pathRewrite: { '^/api': '' }
                }
            },
            contentBase: distPath,
            publicPath: '/',
            historyApiFallback: true,
            host: '0.0.0.0',
            port,
            inline: true,
            disableHostCheck: true,
            https: false,
            stats: 'errors-only',
            clientLogLevel: 'error'
        },
        resolve: {
            symlinks: false,
            extensions: ['.js', '.jsx', '.less'],
            modules: ['node_modules', srcPath],
            alias: {
                react: isDev ? 'react' : nodeModulesPath('/react/umd/react.production.min.js'),
                redux: nodeModulesPath('/redux/dist/redux.min.js'),
                'react-redux': nodeModulesPath('/react-redux/dist/react-redux.min.js'),
                '@': path.join(__dirname, 'src'),
                i18n: path.join(__dirname, 'src/i18n'),
                components: path.join(__dirname, 'src/components'),
                containers: path.join(__dirname, 'src/containers'),
                layouts: path.join(__dirname, 'src/layouts'),
                common: path.join(__dirname, 'src/common'),
                reducers: path.join(__dirname, 'src/reducers'),
                pages: path.join(__dirname, 'src/pages'),
                services: path.join(__dirname, 'src/services'),
                utils: path.join(__dirname, 'src/utils'),
                styles: path.join(__dirname, 'src/styles'),
                sagas: path.join(__dirname, 'src/sagas'),
                store: path.join(__dirname, 'src/store'),
                public: path.join(__dirname, 'public'),
                AsyncComponent: path.join(__dirname, 'src/components/AsyncComponent.jsx')
            }
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: ['eslint-loader', 'source-map-loader'],
                    enforce: 'pre',
                    exclude: /(node_modules|src\/libs|libs)/
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|src\/libs|libs)/,
                    include: srcPath,
                    use: [
                        {
                            loader: 'cache-loader',
                            options: {
                                cacheDirectory: path.join(cachePath, 'jscache')
                            }
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                extends: path.join(__dirname, '.babelrc')
                            }
                        }
                    ]
                },
                {
                    test: /.css$/,
                    include: srcPath,
                    use: styleLoaderConfig()
                },
                {
                    test: /\.(css|less)$/,
                    include: /(node_modules)/,
                    exclude: srcPath,
                    use: styleLoaderConfig()
                },
                {
                    test: /\.less$/,
                    include: stylePath,
                    use: styleLoaderConfig({ useCssModule: false }),
                    exclude: /(node_modules)/
                },
                {
                    test: /\.less$/,
                    include: /(src\/pages|src\/components|src\/containers|src\/layouts)/,
                    use: styleLoaderConfig({ useCssModule: true }),
                    exclude: /(node_modules)/
                },
                {
                    test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
                    include: publicPath,
                    exclude: srcPath,
                    use: [
                        {
                            loader: 'url-loader',
                            options: { limit: 8192, name: filesNameMapper.fontFilename }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    include: srcPath,
                    exclude: /(fonts)/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: { limit: 8124, name: filesNameMapper.imgFilename }
                        }
                    ]
                }
            ]
        },
        resolveLoader: {
            moduleExtensions: ['-loader']
        },
        externals: {
            moment: false
        },
        plugins,
        optimization: {
            occurrenceOrder: false,
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /(vendors|babel-runtime|core-js|react-router-dom|moment)/,
                        priority: 10,
                        enforce: true,
                        name: 'vendors',
                        chunks: 'all',
                        minChunks: 1,
                        minSize: 0,
                        reuseExistingChunk: true
                    }
                    // antd: {
                    //     test: /(antd|create-react-class|async-validator|rc-)/,
                    //     priority: 10,
                    //     enforce: true,
                    //     name: 'antd',
                    //     chunks: 'all',
                    //     minChunks: 1,
                    //     minSize: 0,
                    //     reuseExistingChunk: true
                    // }
                }
            }
        },
        performance: {
            hints: false
        },
        cache: true,
        watch: false,
        devtool: isDev ? 'cheap-module-source-map' : false
    };
};

function styleLoaderConfig(options = {}) {
    const useCssModule = options.useCssModule || false;
    return [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
            loader: 'cache-loader',
            options: {
                cacheDirectory: path.join(cachePath, 'csscache')
            }
        },
        {
            loader: 'css-loader',
            options: {
                importLoaders: 2,
                modules: useCssModule,
                localIdentName: '[local]--[hash:base64:4]'
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                config: {
                    path: path.join(__dirname, 'postcss.config.js'),
                    ctx: {
                        autoprefixer: {
                            browsers: ['Safari >= 10', 'last 1 firefox version', 'Chrome >= 62', 'Explorer >= 10']
                        },
                        cssnano: { preset: 'default' },
                        cssVariables: {}
                    }
                }
            }
        },
        {
            loader: 'less-loader',
            options: {
                javascriptEnabled: true,
                modifyVars: {
                    '@icon-url': '"../../../../../public/fonts/iconfont"'
                }
            }
        }
    ];
}

function nodeModulesPath(filePath) {
    return path.join(__dirname, 'node_modules', filePath);
}
