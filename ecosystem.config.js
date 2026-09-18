const path = require("path");
const path = require("path");
let DEPLOY_SERVER, DEPLOY_USER, DEPLOY_REPO, DEPLOY_PATH;

try {
  require("dotenv").config({ path: ".env.deploy" });
  ({ DEPLOY_SERVER, DEPLOY_USER, DEPLOY_REPO, DEPLOY_PATH } = process.env);
} catch (e) {
  // На сервере .env.deploy и dotenv не нужны — эти переменные
  // используются только локально, при запуске "pm2 deploy"
}

module.exports = {
  apps: [
    {
      name: "mesto-backend",
      script: "dist/app.js",
      cwd: path.join(__dirname, "backend"),
      env: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_SERVER,
      ref: "origin/main",
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,

      // Копируем .env бэкенда в shared-папку на сервере (сохраняется между деплоями)
      "pre-deploy-local": `scp backend/.env ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/shared/.env`,

      // Собираем бэкенд, подключаем .env, собираем фронтенд, перезапускаем pm2
      "post-deploy": [
        "cd backend && npm install && npm run build && cd ..",
        `ln -sf ${DEPLOY_PATH}/shared/.env backend/.env`,
        "cd frontend && npm install && npm run build && cd ..",
        "pm2 reload ecosystem.config.js --env production",
      ].join(" && "),
    },
  },
};
