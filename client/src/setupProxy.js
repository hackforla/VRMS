// setupProxy.js - Dynamically setup a proxy from the frontend to the backend. This file
// does not need to be imported. https://create-react-app.dev/docs/adding-custom-environment-variables/

const { createProxyMiddleware } = require('http-proxy-middleware');

function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY,
      changeOrigin: true,
    })
  );
}

module.exports = setupProxy;
