const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const app = express();
const port = process.env.PORT || 8181;
app.use(express.static(`${__dirname}/dist`));
app.use(
    '^/api',
    proxy('http://localhost:3000', {
        proxyReqPathResolver: function(req) {
            return `/api${req.url}`;
        }
    })
);
app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/dist/index.html`));
});
app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
module.exports = app;
