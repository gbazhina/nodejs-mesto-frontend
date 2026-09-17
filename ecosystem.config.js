const dotenv = require('dotenv');

dotenv.config({ path: '.env.deploy' });

const {
  DEPLOY_SERVER,
  DEPLOY_USER,
  DEPLOY_REPO,
  DEPLOY_PATH,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      cwd: `${DEPLOY_PATH}/current`,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_SERVER,
      ref: 'origin/main',
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,

      // Копируем .env с локального компьютера в shared-папку на сервере
      // (эта папка сохраняется между деплоями)
      'pre-deploy-local': `scp .env ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/shared/.env`,

      // Устанавливаем зависимости, собираем TS -> JS, подключаем .env, перезапускаем через pm2
      'post-deploy': [
        'npm install',
        'npm run build',
        `ln -sf ${DEPLOY_PATH}/shared/.env .env`,
        'pm2 reload ecosystem.config.js --env production',
      ].join(' && '),
    },
  },
};
