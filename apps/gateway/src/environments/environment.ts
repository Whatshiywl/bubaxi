export const environment = {
  production: false,
  proxy: {
    '/quintozap': {
      paths: {
        '/api': 'http://localhost:3020/',
        '/':    'http://localhost:8020/'
      }
    },
    '/': {
      paths: {
        '/api': 'http://localhost:3010/',
        '/':    'http://localhost:8010/'
      }
    }
  }
};
