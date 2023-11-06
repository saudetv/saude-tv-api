module.exports = {
  apps: [
    {
      name: "SAUDE-TV-API",
      script: "server.js",
      watch: true,
      interpreter_args:
        "--experimental-loader=newrelic/esm-loader.mjs --trace-warnings",
      env: {
        NEW_RELIC_APP_NAME: "SAUDE-TV-API",
        NEW_RELIC_LICENSE_KEY: "0aeaae854caf04d829f3f179be5710f4FFFFNRAL",
      },
    },
  ],
};
