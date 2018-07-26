module.exports = ({ options, env }) => ({
    plugins: {
        autoprefixer: env === 'production' ? options.autoprefixer : false,
        cssnano: env === 'production' ? options.cssnano : false,
        'postcss-short': require('postcss-short')()
    }
});
