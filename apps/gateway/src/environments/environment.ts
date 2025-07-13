export const environment = {
  production: false,
  proxy: {
    '/vjrnb': {
      paths: {
        '/':    'http://localhost:3100/'
      }
    },
    '/quintozap': {
      paths: {
        '/':    'http://localhost:3020/'
      }
    },
    '/homaxi': {
      paths: {
        '/': 'http://localhost:3010'
      }
    }
  },
  corsAllowedOrigins: [/^http:\/\/localhost:\d+$/]
};
