const path = require('path');

let DEPLOY_SERVER, DEPLOY_USER, DEPLOY_REPO, DEPLOY_PATH, DEPLOY_BRANCH;

try {
  require('dotenv').config({ path: '.env.deploy' });
  ({ DEPLOY_SERVER, DEPLOY_USER, DEPLOY_REPO, DEPLOY_PATH, DEPLOY_BRANCH } = process.env);
} catch (e) {
  // На сервере .env.deploy и dotenv не нужны — эти переменные
  // используются только локально, при запуске "pm2 deploy"
}

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_SERVER,
      ref: `origin/${DEPLOY_BRANCH || 'main'}`,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,

      // pre-deploy: копируем .env с локального компьютера в shared-папку на сервере
      'pre-deploy-local': `scp .env ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/shared/.env`,

      // post-deploy: устанавливаем зависимости, собираем, подключаем .env, запускаем через pm2
      'post-deploy': [
        'cd backend && npm install && npm run build && cd ..',
        `ln -sf ${DEPLOY_PATH}/shared/.env backend/.env`,
        'pm2 reload backend/ecosystem.config.js --env production',
      ].join(' && '),
    },
  },
};
