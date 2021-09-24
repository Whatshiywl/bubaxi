export const environment = {
  production: false,
  proxy: {
    '/sre': {
      paths: {
        // '/api': 'http://localhost:3030/',
        '/':    'http://localhost:8030/'
      }
    },
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
