const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    createProxyMiddleware("/python", {
      target: "http://localhost:5000",
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware("/spring", {
      target: "http://localhost:8080",
      changeOrigin: true,
    }),
  );
};