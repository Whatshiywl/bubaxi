export const environment = {
  production: false,
  proxy: {
    '/vjrnb': {
      paths: {
        '/api': 'http://localhost:3100/',
        '/':    'http://localhost:8100/'
      }
    },
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
    '/homaxi': {
      paths: {
        '/': 'http://localhost:3010'
      }
    }
    // '/': {
    //   paths: {
    //     '/api': 'http://localhost:3010/',
    //     '/':    'http://localhost:8010/'
    //   }
    // }
  },
  corsAllowedOrigins: [/^http:\/\/localhost:\d+$/]
};
