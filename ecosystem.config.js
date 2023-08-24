module.exports = {
  apps: [
    {
      name: 'app',
      script: 'yarn run start',
      cwd: '/home/bitnami/cps-server',
      env_production: { NODE_ENV: 'production' },
      env_development: { NODE_ENV: 'development' },
    },
  ],
};
