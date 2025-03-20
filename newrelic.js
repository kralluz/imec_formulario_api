"use strict";

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || "IMEC Form API"],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || "SUA_CHAVE_DE_LICENÇA_AQUI",
  logging: {
    level: "info",
  },
};
