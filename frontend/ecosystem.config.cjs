let DEPLOY_SERVER, DEPLOY_USER, DEPLOY_REPO, DEPLOY_PATH, DEPLOY_BRANCH;

try {
  require('dotenv').config({ path: '.env.deploy' });
  ({ DEPLOY_SERVER, DEPLOY_USER, DEPLOY_REPO, DEPLOY_PATH, DEPLOY_BRANCH } = process.env);
} catch (e) {
  // На сервере .env.deploy не нужен — эти переменные
  // используются только локально, при запуске "pm2 deploy"
}

module.exports = {
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_SERVER,
      ref: `origin/${DEPLOY_BRANCH || 'main'}`,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,

      // post-deploy: устанавливаем зависимости и собираем статику (Vite -> dist)
      // Раздавать собранную статику будет nginx
      'post-deploy': 'cd frontend && npm install && npm run build && cd ..',
    },
  },
};
