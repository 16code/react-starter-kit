module.exports = ({ options, env }) => ({
    plugins: {
        autoprefixer: env === 'production' ? options.autoprefixer : false,
        cssnano: env === 'production' ? options.cssnano : false,
        'postcss-css-variables': env === 'production' ? options.cssVariables : false,
        'postcss-short': require('postcss-short')({
            size: {
                skip: '*'
            }
        })
    }
});
