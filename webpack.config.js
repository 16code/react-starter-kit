const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const distPath = path.join(__dirname, 'dist');
const cachePath = path.join(__dirname, '.cache');
const srcPath = path.join(__dirname, 'src');
const stylePath = path.join(__dirname, 'src/styles');
const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 8181;

const filesNameMapper = {
    filename: isDev ? '[name].js' : 'assets/vendor/[name].[chunkhash:5].js',
    chunkFilename: isDev ? '[name].chunk.js' : 'assets/js/[name].[chunkhash:5].chunk.js',
    cssFilename: isDev ? '[name].css' : 'assets/vendor/[name].[chunkhash:5].css',
    imgFilename: 'assets/images/[name].[hash:5].[ext]',
    fontFilename: 'assets/fonts/[name].[ext]?[hash:5]'
};
const plugins = [
    new webpack.DefinePlugin({ __DEV__: isDev }),
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
        asyncComponent: 'AsyncComponent'
    }),
    new ExtractTextPlugin({
        filename: filesNameMapper.cssFilename,
        allChunks: true,
        disable: isDev && true,
        ignoreOrder: true
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
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        threshold: 10240,
        minRatio: 0.8
    })
];

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
    } else {
        plugins.push(...productionPlugins);
    }
    return {
        mode: isDev ? 'development' : 'production',
        entry: {
            vendors: ['./src/vendors.js'],
            app: ['./src/index.jsx']
        },
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
                'react-dom': isDev ? 'react-dom' : nodeModulesPath('/react-dom/umd/react-dom.production.min.js'),
                'react-router-dom': isDev
                    ? 'react-router-dom'
                    : nodeModulesPath('/react-router-dom/umd/react-router-dom.min.js'),
                redux: nodeModulesPath('/redux/dist/redux.min.js'),
                'react-redux': nodeModulesPath('/react-redux/dist/react-redux.min.js'),
                src: path.join(__dirname, 'src'),
                components: path.join(__dirname, 'src/components'),
                containers: path.join(__dirname, 'src/containers'),
                layouts: path.join(__dirname, 'src/containers/layouts'),
                common: path.join(__dirname, 'src/common'),
                reducers: path.join(__dirname, 'src/reducers'),
                pages: path.join(__dirname, 'src/pages'),
                services: path.join(__dirname, 'src/services'),
                utils: path.join(__dirname, 'src/utils'),
                styles: path.join(__dirname, 'src/styles'),
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
                    test: /\.css$/,
                    include: srcPath,
                    use: ExtractTextPlugin.extract(styleLoaderConfig())
                },
                {
                    test: /\.less$/,
                    include: stylePath,
                    use: ExtractTextPlugin.extract(styleLoaderConfig({ useCssModule: false })),
                    exclude: /(node_modules)/
                },
                {
                    test: /\.less$/,
                    include: /(src\/pages|src\/components|src\/containers)/,
                    use: ExtractTextPlugin.extract(styleLoaderConfig({ useCssModule: true })),
                    exclude: /(node_modules)/
                },
                {
                    test: /\.(woff|woff2|ttf|eot)(\?]?.*)?$/,
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
            moment: true
        },
        plugins,
        optimization: {
            occurrenceOrder: true,
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /(vendors|babel-runtime|core-js)/,
                        priority: 10,
                        enforce: true,
                        name: 'vendors',
                        chunks: 'all',
                        minChunks: 1,
                        minSize: 0,
                        reuseExistingChunk: true
                    }
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
    const { useCssModule } = options;
    return {
        fallback: 'style-loader',
        use: [
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
                    modules: useCssModule && useCssModule,
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
                    javascriptEnabled: true
                }
            }
        ]
    };
}

function nodeModulesPath(filePath) {
    return path.join(__dirname, 'node_modules', filePath);
}
